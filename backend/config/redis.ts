import 'dotenv/config';

import { createClient } from 'redis';

const redisClient = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT!
    }
});


redisClient.on('error', (error) => console.error('Redis Client Error', error));

(
    async () => {
        await redisClient.connect();
        console.log('Redis connected');
    }
)();

export default redisClient;