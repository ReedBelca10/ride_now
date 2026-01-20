/**
 * Service Supabase
 * Gère l'upload et la suppression d'images dans les buckets Supabase
 */

import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;
  private bucket: string;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    this.bucket = process.env.SUPABASE_VEHICLE_BUCKET || 'vehicle-images';

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requis');
    }

    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
  }

  /**
   * Upload une image de véhicule
   * @param file - Fichier à uploader
   * @param bucket - Nom du bucket
   * @param path - Chemin du fichier dans le bucket
   */
  async uploadVehicleImage(
    file: Buffer,
    bucket: string = this.bucket,
    path: string,
  ): Promise<{ url: string; path: string }> {
    try {
      const { data, error } = await this.supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        throw new Error(`Erreur Supabase: ${error.message}`);
      }

      // Construire l'URL publique
      const {
        data: { publicUrl },
      } = this.supabase.storage.from(bucket).getPublicUrl(path);

      return {
        url: publicUrl,
        path: data.path,
      };
    } catch (error) {
      throw new Error(
        `Erreur lors de l'upload de l'image: ${error.message}`,
      );
    }
  }

  /**
   * Supprime une image de véhicule
   * @param path - Chemin du fichier à supprimer
   * @param bucket - Nom du bucket
   */
  async deleteVehicleImage(
    path: string,
    bucket: string = this.bucket,
  ): Promise<void> {
    try {
      const { error } = await this.supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) {
        throw new Error(`Erreur Supabase: ${error.message}`);
      }
    } catch (error) {
      throw new Error(
        `Erreur lors de la suppression de l'image: ${error.message}`,
      );
    }
  }

  /**
   * Obtient l'URL publique d'une image
   * @param path - Chemin du fichier
   * @param bucket - Nom du bucket
   */
  getPublicUrl(
    path: string,
    bucket: string = this.bucket,
  ): string {
    const {
      data: { publicUrl },
    } = this.supabase.storage.from(bucket).getPublicUrl(path);

    return publicUrl;
  }

  /**
   * Supprime plusieurs images
   * @param paths - Liste des chemins à supprimer
   * @param bucket - Nom du bucket
   */
  async deleteVehicleImages(
    paths: string[],
    bucket: string = this.bucket,
  ): Promise<void> {
    try {
      const { error } = await this.supabase.storage
        .from(bucket)
        .remove(paths);

      if (error) {
        throw new Error(`Erreur Supabase: ${error.message}`);
      }
    } catch (error) {
      throw new Error(
        `Erreur lors de la suppression des images: ${error.message}`,
      );
    }
  }
}
