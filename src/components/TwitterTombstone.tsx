import { useState } from 'react';
import { TwitterForm } from './TwitterForm';
import { Tombstone } from './Tombstone';
import type { Tombstone as TombstoneType } from '@/lib/supabase';

export function TwitterTombstone() {
  const [tombstone, setTombstone] = useState<TombstoneType | null>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-8">
      {!tombstone ? (
        <div className="w-full max-w-md">
          <TwitterForm
            onProfileFetched={setTombstone}
            className="tombstone-form p-6"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6">
          <Tombstone {...tombstone} />
          
          <button
            onClick={() => setTombstone(null)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Create Another Tombstone
          </button>
        </div>
      )}
    </div>
  );
} 