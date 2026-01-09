import Redis from 'ioredis';

const redisHost = process.env.REDIS_HOST || 'localhost';
const redis = new Redis({ host: redisHost });
const QUEUE_NAME = 'job-queue';
const PROCESSING_QUEUE = 'processing-queue';
const COMPLETED_QUEUE = 'completed-queue';

async function main() {
  console.log("👨‍🍳 Chef (Worker) started! Waiting for orders...");

  while (true) {
    // 1. Get the order (Move from Waiting -> Cooking)
    const jobJson = await redis.brpoplpush(QUEUE_NAME, PROCESSING_QUEUE, 0);
    
    if (jobJson) {
      const job = JSON.parse(jobJson);
      console.log(`🍳 Cooking Order: ${job.id} (${job.data.item})`);

      // -----------------------------------------------------------------
      // 🔥 CHAOS SIMULATION: If this is a FIRE job, crash the process!
      if (job.type === 'kitchen-fire') {
        console.log("🔥 KITCHEN FIRE! CHEF ABANDONING STATION!");
        // We exit with '1' (Error code). Docker will see this and restart the container.
        process.exit(1); 
      }
      // -----------------------------------------------------------------

      // Simulate Cooking Time (2 seconds)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Move to "Ready to Serve"
      await redis.lpush(COMPLETED_QUEUE, jobJson);
      await redis.ltrim(COMPLETED_QUEUE, 0, 49); 
      await redis.lrem(PROCESSING_QUEUE, 1, jobJson);
      
      console.log(`✅ Order Up: ${job.id}`);
    }
  }
}

main();