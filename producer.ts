import Redis from 'ioredis';

// If REDIS_HOST env var is set (Docker), use it. Otherwise use localhost (Laptop).
const redisHost = process.env.REDIS_HOST || 'localhost';
const redis = new Redis({ host: redisHost });
const QUEUE_NAME = 'job-queue';

async function addJob(jobData: any) {
  // We push a stringified JSON object to the queue
  await redis.lpush(QUEUE_NAME, JSON.stringify(jobData));
  console.log(`✅ Job added: ${jobData.id}`);
}

// Simulate a user adding 5 jobs
async function main() {
  for (let i = 1; i <= 5; i++) {
    await addJob({
      id: `job-${i}`,
      type: 'email-notification',
      payload: { user: `User ${i}`, message: 'Welcome!' }
    });
  }
  process.exit(0);
}

main();