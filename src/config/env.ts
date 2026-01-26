import dotenv from 'dotenv';
dotenv.config();

const requiredVars = ['PORT', 'MONGO_URI'] as const;

requiredVars.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
});

export const env = {
    port: Number(process.env.PORT),
    mongoUri: process.env.MONGO_URI as string,
};
