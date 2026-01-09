import Redis from 'ioredis';

const redisHost = process.env.REDIS_HOST || 'localhost';
const redis = new Redis({ host: redisHost });
const QUEUE_NAME = 'job-queue';
const PROCESSING_QUEUE = 'processing-queue';

async function recoverJobs() {
    console.log("🚑 Recovery Service checking for zombie jobs...");

    // Check if there are any jobs stuck in the processing queue
    const len = await redis.llen(PROCESSING_QUEUE);

    if (len === 0) {
        console.log("✅ No stuck jobs found. System is healthy.");
        process.exit(0);
    }

    console.log(`⚠️ Found ${len} stuck jobs! Moving them back to queue...`);

    for (let i = 0; i < len; i++) {
        // RPOPLPUSH (source, destination)
        // Moves the job from the Right of 'processing' to the Left of 'job-queue'
        const stuckJob = await redis.rpoplpush(PROCESSING_QUEUE, QUEUE_NAME);
        console.log(`🚑 Recovered job: ${stuckJob}`);
    }

    console.log("✅ Recovery complete. Workers can now process these jobs.");
    process.exit(0);
}

recoverJobs();