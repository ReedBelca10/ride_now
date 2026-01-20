/**
 * Module Email
 * Fournit les services d'email pour l'application
 */

import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

@Module({
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule {}
