import Redis from 'ioredis';

const redisHost = process.env.REDIS_HOST || 'localhost';
const redis = new Redis({ host: redisHost });
const QUEUE_NAME = 'job-queue';
const PROCESSING_QUEUE = 'processing-queue';

async function main() {
  console.log("🛡️ Reliable Worker started! Waiting for jobs...");

  while (true) {
    const jobJson = await redis.brpoplpush(QUEUE_NAME, PROCESSING_QUEUE, 0);
    
    if (jobJson) {
      const job = JSON.parse(jobJson);
      console.log(`⚙️  Processing ${job.id}...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // ---------------------------------------------------------
      // ⚠️ CRASH SIMULATION: Uncomment this line to test fault tolerance!
      // if (Math.random() > 0.7) { console.log("💥 CRASHING!"); process.exit(1); }
      // ---------------------------------------------------------

// Move from 'processing-queue' to 'completed-queue'
// We only keep the last 50 jobs so Redis doesn't fill up forever.
await redis.lpush('completed-queue', jobJson);
await redis.ltrim('completed-queue', 0, 49); // Keep only top 50
await redis.lrem(PROCESSING_QUEUE, 1, jobJson);

console.log(`✨ Completed ${job.id}`);
    }
  }
}

main();