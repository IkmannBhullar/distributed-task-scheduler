import Redis from 'ioredis';

const redisHost = process.env.REDIS_HOST || 'localhost';
const redis = new Redis({ host: redisHost });
const QUEUE_NAME = 'job-queue';
const PROCESSING_QUEUE = 'processing-queue';

async function monitor() {
  console.log("🚑 Safety Inspector (Auto-Fix) is watching...");

  setInterval(async () => {
    // Get all jobs currently "Cooking"
    const jobs = await redis.lrange(PROCESSING_QUEUE, 0, -1);

    for (const jobJson of jobs) {
      const job = JSON.parse(jobJson);
      const timeInKitchen = Date.now() - job.data.addedAt;

      // If cooking for > 10 seconds, the Chef probably died/burned it.
      if (timeInKitchen > 10000) {
        console.log(`⚠️ Order ${job.id} is stuck! Re-assigning to new Chef...`);
        
        // Transaction: Remove from Processing -> Push back to New Orders
        const multi = redis.multi();
        multi.lrem(PROCESSING_QUEUE, 1, jobJson);
        multi.lpush(QUEUE_NAME, jobJson);
        await multi.exec();
      }
    }
  }, 3000); // Check every 3 seconds
}

monitor();