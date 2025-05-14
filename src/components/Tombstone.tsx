import { motion } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Tombstone as TombstoneType } from '@/lib/supabase';

export interface TombstoneProps extends Partial<TombstoneType> {
  className?: string;
  approved?: boolean;
}

export function Tombstone({ 
  avatar_url,
  username,
  title,
  description,
  promo_url,
  buried_at,
  className 
}: TombstoneProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const formattedDate = buried_at 
    ? new Date(buried_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null;

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative w-[300px] h-[400px] select-none cursor-pointer",
        className
      )}
      onClick={() => setShowDetails(!showDetails)}
    >
      {/* Tombstone Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-300 to-stone-400 rounded-t-[150px] shadow-xl">
        {/* Texture Overlay */}
        <div className="absolute inset-0 bg-[url('/textures/stone.png')] opacity-20 mix-blend-overlay rounded-t-[150px]" />
        
        {/* Inner Shadow */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent rounded-t-[150px]" />
        
        {/* Profile Picture Frame */}
        <div className="absolute top-[80px] left-1/2 -translate-x-1/2 w-[140px] h-[140px] rounded-full bg-gradient-to-b from-stone-200 to-stone-300 p-3 shadow-lg">
          {avatar_url && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: imageLoaded ? 1 : 0.8, opacity: imageLoaded ? 1 : 0 }}
              className="relative w-full h-full rounded-full overflow-hidden bg-stone-200"
            >
              <img 
                src={avatar_url} 
                alt={username}
                onLoad={() => setImageLoaded(true)}
                className="w-full h-full object-cover"
              />
              {/* Frame Border */}
              <div className="absolute inset-0 border-4 border-stone-300/50 rounded-full" />
            </motion.div>
          )}
        </div>

        {/* Content */}
        <div className="absolute top-[240px] left-1/2 -translate-x-1/2 w-[80%] text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            {/* Title */}
            {title && (
              <h2 className="text-xl font-serif text-stone-800">
                {title}
              </h2>
            )}

            {/* Username */}
            {username && (
              <p className="text-sm text-stone-600">
                @{username}
              </p>
            )}

            {/* Description (shown on click) */}
            {description && showDetails && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-2"
              >
                <p className="text-sm text-stone-600 italic">
                  "{description}"
                </p>
                {promo_url && (
                  <a
                    href={promo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline mt-2 inline-block"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Visit Memorial
                  </a>
                )}
              </motion.div>
            )}

            {/* Burial Date */}
            {formattedDate && (
              <p className="text-xs text-stone-500 mt-4">
                Laid to rest on {formattedDate}
              </p>
            )}
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-[20px] left-1/2 -translate-x-1/2 w-[60%] h-[2px] bg-gradient-to-r from-transparent via-stone-600/30 to-transparent" />
        <div className="absolute bottom-[40px] left-1/2 -translate-x-1/2 w-[70%] h-[1px] bg-gradient-to-r from-transparent via-stone-600/20 to-transparent" />
      </div>

      {/* Ground Shadow */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[80%] h-[20px] bg-black/20 blur-xl rounded-full" />
    </motion.div>
  );
}
