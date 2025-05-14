import { createClient } from '@supabase/supabase-js';
import { env } from '@/env';

export const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY
);

export interface Tombstone {
  id: string;
  x: number;
  y: number;
  z: number;
  twitter_handle: string;
  username: string;
  avatar_url: string;
  title: string;
  description: string;
  promo_url?: string;
  buried_at: string;
}

export async function createTombstone(tombstone: Omit<Tombstone, 'id' | 'buried_at'>): Promise<Tombstone | null> {
  const { data, error } = await supabase
    .from('tombstones')
    .insert([tombstone])
    .select()
    .single();

  if (error) {
    console.error('Error creating tombstone:', error);
    return null;
  }

  return data;
}

export async function getTombstones(): Promise<Tombstone[]> {
  const { data, error } = await supabase
    .from('tombstones')
    .select('*')
    .order('buried_at', { ascending: false });

  if (error) {
    console.error('Error fetching tombstones:', error);
    return [];
  }

  return data;
}

export async function getTombstoneByTwitterHandle(twitter_handle: string): Promise<Tombstone | null> {
  const { data, error } = await supabase
    .from('tombstones')
    .select('*')
    .eq('twitter_handle', twitter_handle)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // Record not found
      return null;
    }
    console.error('Error fetching tombstone:', error);
    return null;
  }

  return data;
} 