import { createClient } from '@supabase/supabase-js';
import { env } from '@/env';

export const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY
);

// Minimum distance between tombstones
const MIN_DISTANCE = 2;

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
  transaction_id: string;
  payment_status: 'completed' | 'pending' | 'failed';
}

export async function isPositionAvailable(x: number, z: number): Promise<boolean> {
  // Check for any tombstones within MIN_DISTANCE radius
  const { data } = await supabase
    .from('tombstones')
    .select('x, z')
    .eq('payment_status', 'completed')
    .or(`x.gte.${x - MIN_DISTANCE},x.lte.${x + MIN_DISTANCE}`)
    .or(`z.gte.${z - MIN_DISTANCE},z.lte.${z + MIN_DISTANCE}`);

  if (!data || data.length === 0) return true;

  // Check if any existing tombstone is too close
  return !data.some(tombstone => {
    const distance = Math.sqrt(
      Math.pow(tombstone.x - x, 2) + 
      Math.pow(tombstone.z - z, 2)
    );
    return distance < MIN_DISTANCE;
  });
}

export async function createTombstone(
  tombstone: Omit<Tombstone, 'id' | 'buried_at'> & { transaction_id: string }
): Promise<Tombstone | null> {
  // Check if position is available
  const isAvailable = await isPositionAvailable(tombstone.x, tombstone.z);
  if (!isAvailable) {
    throw new Error('Position is already taken');
  }

  // Check if user already has a tombstone
  const existingTombstone = await getTombstoneByTwitterHandle(tombstone.twitter_handle);
  if (existingTombstone) {
    throw new Error('User already has a tombstone');
  }

  // Check if transaction_id is unique
  const { data: existingTransaction } = await supabase
    .from('tombstones')
    .select('id')
    .eq('transaction_id', tombstone.transaction_id)
    .single();

  if (existingTransaction) {
    throw new Error('Transaction has already been used');
  }

  // Try up to 3 times to create the tombstone
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const { data, error } = await supabase
        .from('tombstones')
        .insert([{
          ...tombstone,
          payment_status: 'completed',
          buried_at: new Date().toISOString()
        }])
    .select()
    .single();

  if (error) {
        console.error(`Error creating tombstone (attempt ${attempt}/3):`, error);
        if (attempt === 3) return null;
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        continue;
  }

  return data;
    } catch (err) {
      console.error(`Unexpected error creating tombstone (attempt ${attempt}/3):`, err);
      if (attempt === 3) return null;
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, attempt * 1000));
    }
  }

  return null;
}

export async function getTombstones(): Promise<Tombstone[]> {
  const { data, error } = await supabase
    .from('tombstones')
    .select('*')
    .eq('payment_status', 'completed')
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
    .eq('payment_status', 'completed')
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