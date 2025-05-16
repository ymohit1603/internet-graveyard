import { Button } from '@/components/ui/button';
import { TombstoneProps } from './Tombstone';
import { X } from 'lucide-react';

type TombstoneDetailsProps = {
  tombstone: TombstoneProps;
  onClose: () => void;
};

export const TombstoneDetails = ({ tombstone, onClose }: TombstoneDetailsProps) => {
  const { 
    twitter_handle = '@unknown', 
    username = 'Unknown User', 
    avatar_url = '/placeholder.svg',
    title = 'Untitled Project',
    description = 'No description provided.',
    promo_url,
    buried_at
  } = tombstone;
  
  const formattedDate = buried_at 
    ? new Date(buried_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Unknown date';
  
  const handleShare = () => {
    const shareText = `RIP: "${title}" - ${description} | Internet Graveyard 3D`;
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: `Remembering: ${title}`,
        text: shareText,
        url: shareUrl,
      }).catch((err) => console.error('Error sharing:', err));
    } else {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
        '_blank'
      );
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Side Panel */}
      <aside className="relative ml-auto w-full max-w-md bg-white rounded-l-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-serif font-bold text-gray-900">Memorial Details</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </header>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Profile */}
          <div className="flex items-center gap-4">
            <img 
              src={avatar_url}
              alt={username}
              className="w-16 h-16 rounded-full ring-2 ring-purple-500 object-cover"
            />
            <div>
              <p className="text-lg font-semibold text-gray-900">{twitter_handle}</p>
              <p className="text-sm text-gray-500">{username}</p>
            </div>
          </div>

          {/* Idea Info */}
          <div className="space-y-3">
            <p className="text-xl font-medium text-gray-800">{title}</p>
            <p className="text-sm text-gray-500">Built on {formattedDate}</p>
            <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
              <p className="text-gray-700 italic leading-relaxed">{description}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Button 
              onClick={handleShare}
              variant="secondary"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              Share This Tribute
            </Button>

            {promo_url && (
              <Button 
                onClick={() => window.open(promo_url, '_blank')}
                className="w-full border border-gray-200 hover:bg-gray-100 text-gray-800"
              >
                Visit Project
              </Button>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};
