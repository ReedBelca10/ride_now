import { PrismaService } from './prisma.service';

async function test() {
    try {
        console.log('Testing PrismaService initialization...');
        const prisma = new PrismaService();
        console.log('PrismaService instantiated successfully.');
        await prisma.onModuleInit();
        console.log('PrismaService connected successfully.');
        await prisma.onModuleDestroy();
        console.log('PrismaService disconnected successfully.');
    } catch (error) {
        console.error('PrismaService failed:', error);
        process.exit(1);
    }
}

test();
