/**
 * Script pour créer un utilisateur Admin
 * Usage: npx ts-node seed-admin.ts
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const adminEmail = 'admin@ridenow.com';
    const adminPassword = 'Admin123!';

    // Vérifie si l'admin existe déjà
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail }
    });

    if (existingAdmin) {
        console.log('⚠️  Un administrateur existe déjà avec cet email:', adminEmail);
        console.log('   ID:', existingAdmin.id);
        console.log('   Rôle:', existingAdmin.role);
        return;
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Crée l'admin
    const admin = await prisma.user.create({
        data: {
            email: adminEmail,
            password: hashedPassword,
            firstName: 'Admin',
            lastName: 'System',
            role: 'ADMIN',
            isActive: true,
        }
    });

    console.log('✅ Administrateur créé avec succès!');
    console.log('   Email:', admin.email);
    console.log('   Mot de passe:', adminPassword);
    console.log('   Rôle:', admin.role);
    console.log('');
    console.log('⚠️  IMPORTANT: Changez ce mot de passe après la première connexion!');
}

main()
    .catch((e) => {
        console.error('❌ Erreur:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
