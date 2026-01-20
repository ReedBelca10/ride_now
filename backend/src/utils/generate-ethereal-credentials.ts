/**
 * Script pour générer les credentials Ethereal
 * Exécuter: npx ts-node src/utils/generate-ethereal-credentials.ts
 * Ou: npm run generate:ethereal
 */

import * as nodemailer from 'nodemailer';

async function generateEtherealCredentials() {
    console.log('🌐 Génération des identifiants Ethereal...\n');
    
    try {
        const testAccount = await nodemailer.createTestAccount();
        
        console.log('✅ Compte Ethereal créé avec succès!\n');
        console.log('📋 Ajouter les variables d\'environnement à .env:\n');
        console.log(`ETHEREAL_USER="${testAccount.user}"`);
        console.log(`ETHEREAL_PASSWORD="${testAccount.pass}"\n`);
        
        console.log('📧 Configuration du transporteur:\n');
        console.log(`Host: ${testAccount.smtp.host}`);
        console.log(`Port: ${testAccount.smtp.port}`);
        console.log(`Secure: ${testAccount.smtp.secure}\n`);
        
        console.log('🔗 URL web: https://ethereal.email\n');
        console.log('💡 Conseil: Les emails de test s\'affichent automatiquement dans le navigateur!');
    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
}

generateEtherealCredentials();
