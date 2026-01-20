const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
    try {
        console.log('Checking for existing users...');
        const count = await prisma.user.count();
        console.log(`User count: ${count}`);

        if (count === 0) {
            console.log('No users found. Creating a test user...');
            const user = await prisma.user.create({
                data: {
                    email: 'test@admin.com',
                    password: '1234Admin#', // In a real app, use bcrypt
                    firstName: 'Admin',
                    lastName: 'System',
                    role: 'ADMIN',
                    isActive: true
                }
            });
            console.log('✅ Created test user: test@admin.com');
        } else {
            console.log('✅ Database already has users.');
        }
    } catch (e) {
        console.error('❌ Error seeding user:', e);
    } finally {
        await prisma.$disconnect();
    }
}

run();
