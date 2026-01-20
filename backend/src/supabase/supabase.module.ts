/**
 * Module Supabase
 * Exporte le service Supabase pour l'utiliser dans d'autres modules
 */

import { Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

@Module({
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class SupabaseModule {}
