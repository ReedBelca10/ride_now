/**
 * Service d'email
 * Gère l'envoi des emails (réinitialisation de mot de passe, notifications, etc.)
 */

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        // Configuration du transporteur Nodemailer
        // Priorité aux variables SMTP du .env (Gmail, etc.)
        // Sinon utilise Ethereal (service de test) en développement

        const isProduction = process.env.NODE_ENV === 'production';
        const hasSmtpConfig = process.env.SMTP_USER && process.env.SMTP_PASSWORD;

        if (isProduction || hasSmtpConfig) {
            console.log('📧 Utilisation du transporteur SMTP:', process.env.SMTP_HOST || 'smtp.gmail.com');
            this.transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: parseInt(process.env.SMTP_PORT || '587'),
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD,
                },
            });
        } else {
            console.log('📧 Utilisation du transporteur Ethereal (Développement)');
            this.transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.ETHEREAL_USER || 'test@ethereal.email',
                    pass: process.env.ETHEREAL_PASSWORD || 'test',
                },
            });
        }

        // Vérifier la connexion SMTP au démarrage
        this.transporter.verify((error, success) => {
            if (error) {
                console.error('❌ Erreur de connexion SMTP:', error);
            } else {
                console.log('✅ Serveur SMTP prêt à envoyer des messages');
            }
        });
    }

    /**
     * Envoie un email de réinitialisation de mot de passe
     */
    async sendPasswordResetEmail(
        email: string,
        userName: string,
        resetLink: string,
    ): Promise<void> {
        const mailOptions = {
            from: process.env.SMTP_FROM || 'noreply@ridenow.com',
            to: email,
            subject: '🔐 Réinitialiser votre mot de passe - RideNow',
            html: this.getPasswordResetEmailTemplate(userName, resetLink),
        };

        try {
            console.log(`📡 Tentative d'envoi d'email de reset à: ${email}`);
            const info = await this.transporter.sendMail(mailOptions);

            console.log('✅ Email envoyé avec succès. Response ID:', info.messageId);
            console.log('📦 Envelope:', JSON.stringify(info.envelope));

            // En développement, afficher le lien Ethereal pour tester si applicable
            if (process.env.NODE_ENV !== 'production' && info.envelope && info.envelope.from === 'test@ethereal.email') {
                console.log('🔗 URL de prévisualisation:', nodemailer.getTestMessageUrl(info));
            }
            console.log('🔗 Lien de réinitialisation:', resetLink);
        } catch (error) {
            console.error('❌ Erreur lors de l\'envoi de l\'email (détails complets):', error);
            if (error.code === 'EAUTH') {
                console.error('🔑 Erreur d\'authentification SMTP. Vérifiez vos identifiants.');
            }
        }
    }

    /**
     * Envoie un email de bienvenue
     */
    async sendWelcomeEmail(email: string, userName: string): Promise<void> {
        const mailOptions = {
            from: process.env.SMTP_FROM || 'noreply@ridenow.com',
            to: email,
            subject: '🎉 Bienvenue sur RideNow!',
            html: this.getWelcomeEmailTemplate(userName),
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);

            if (process.env.NODE_ENV !== 'production') {
                console.log('📧 Email de bienvenue envoyé:', nodemailer.getTestMessageUrl(info));
            }
        } catch (error) {
            console.error('❌ Erreur lors de l\'envoi de l\'email de bienvenue:', error);
            // Ne pas lever une erreur pour les emails de bienvenue
        }
    }

    /**
     * Template pour l'email de réinitialisation de mot de passe
     */
    private getPasswordResetEmailTemplate(userName: string, resetLink: string): string {
        return `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    line-height: 1.6;
                    color: #333;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background: #f5f5f5;
                }
                .header {
                    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                    color: white;
                    padding: 30px 20px;
                    text-align: center;
                    border-radius: 8px 8px 0 0;
                }
                .header h1 {
                    margin: 0;
                    font-size: 24px;
                }
                .content {
                    background: white;
                    padding: 30px 20px;
                }
                .button {
                    display: inline-block;
                    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
                    color: white;
                    padding: 12px 32px;
                    text-decoration: none;
                    border-radius: 6px;
                    font-weight: bold;
                    margin: 20px 0;
                }
                .button:hover {
                    background: linear-gradient(135deg, #ea580c 0%, #dc2626 100%);
                }
                .footer {
                    background: #f5f5f5;
                    padding: 20px;
                    text-align: center;
                    font-size: 12px;
                    color: #666;
                    border-radius: 0 0 8px 8px;
                }
                .warning {
                    color: #dc2626;
                    font-size: 14px;
                    margin-top: 20px;
                    padding: 10px;
                    background: #fee2e2;
                    border-left: 4px solid #dc2626;
                    border-radius: 4px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔐 Réinitialisation de mot de passe - Gestion de Flotte</h1>
                </div>
                <div class="content">
                    <p>Bonjour ${userName},</p>
                    <p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte professionnel sur la plateforme **RideNow Fleet**.</p>
                    <p>Si vous êtes à l'origine de cette demande, vous pouvez définir un nouveau mot de passe en cliquant sur le bouton ci-dessous :</p>
                    <p style="text-align: center;">
                        <a href="${resetLink}" class="button">
                            Définir un nouveau mot de passe
                        </a>
                    </p>
                    <p>Ou copiez et collez ce lien dans votre navigateur :</p>
                    <p style="word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 4px; font-size: 12px;">
                        ${resetLink}
                    </p>
                    <div class="warning">
                        <strong>⚠️ Sécurité :</strong>
                        <ul style="margin: 10px 0; padding-left: 20px;">
                            <li>Ce lien de sécurité est valable pendant 1 heure.</li>
                            <li>Si vous n'avez pas sollicité cette action, veuillez ignorer ce message.</li>
                            <li>Votre mot de passe actuel reste inchangé tant que vous n'avez pas cliqué sur le lien.</li>
                        </ul>
                    </div>
                </div>
                <div class="footer">
                    <p>© 2026 RideNow Fleet Management. Application Interne.</p>
                    <p>Ceci est un email automatique, merci de ne pas y répondre.</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    /**
     * Template pour l'email de bienvenue
     */
    private getWelcomeEmailTemplate(userName: string): string {
        return `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    line-height: 1.6;
                    color: #333;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background: #f5f5f5;
                }
                .header {
                    background: linear-gradient(135deg, #059669 0%, #047857 100%);
                    color: white;
                    padding: 30px 20px;
                    text-align: center;
                    border-radius: 8px 8px 0 0;
                }
                .header h1 {
                    margin: 0;
                    font-size: 28px;
                }
                .content {
                    background: white;
                    padding: 30px 20px;
                }
                .button {
                    display: inline-block;
                    background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
                    color: white;
                    padding: 12px 32px;
                    text-decoration: none;
                    border-radius: 6px;
                    font-weight: bold;
                    margin: 20px 0;
                }
                .features {
                    margin: 20px 0;
                    padding: 15px;
                    background: #f0fdf4;
                    border-left: 4px solid #059669;
                    border-radius: 4px;
                }
                .features ul {
                    margin: 10px 0;
                    padding-left: 20px;
                }
                .footer {
                    background: #f5f5f5;
                    padding: 20px;
                    text-align: center;
                    font-size: 12px;
                    color: #666;
                    border-radius: 0 0 8px 8px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Bienvenue sur RideNow!</h1>
                </div>
                <div class="content">
                    <p>Bonjour ${userName},</p>
                    <p>Merci de vous être inscrit sur RideNow! Nous sommes heureux de vous accueillir.</p>
                    <p>Vous avez maintenant accès à notre plateforme de location de véhicules premium.</p>
                    <div class="features">
                        <strong>✨ Qu'est-ce que vous pouvez faire:</strong>
                        <ul>
                            <li>Parcourir nos véhicules haut de gamme</li>
                            <li>Réserver facilement en quelques clics</li>
                            <li>Gérer vos réservations</li>
                            <li>Avis et noter vos expériences</li>
                            <li>Accéder à votre profil personnel</li>
                        </ul>
                    </div>
                    <p style="text-align: center;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/vehicles" class="button">
                            Voir nos véhicules
                        </a>
                    </p>
                </div>
                <div class="footer">
                    <p>© 2026 RideNow. Tous droits réservés.</p>
                    <p>Cette plateforme vous connecte aux véhicules les plus exclusifs</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }
}
