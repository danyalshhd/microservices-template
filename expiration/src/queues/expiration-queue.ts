import Queue from "bull";

interface Payload {
    accountId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
    redis: {
        host: process.env.REDIS_HOST
    }
})

expirationQueue.process(async (job) => {
    console.log(
        'I want to publish an expiration:complete event for accountId',
        job.data.accountId
    );
});

export { expirationQueue };