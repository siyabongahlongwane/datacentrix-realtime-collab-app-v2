import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const db = (async function () {
    try {
        await prisma.$connect();
        console.info("Database connection successful.");
    } catch (e: any) {
        console.error("Unable to connect to the database.", e);
        throw new Error("Unable to connect to the database.");
    }
})()

export { prisma, db };