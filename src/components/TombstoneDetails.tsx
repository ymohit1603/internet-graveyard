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
    const shareText = `RIP: "${title}" - ${description} | Check out the Internet Graveyard 3D`;
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: `Internet Graveyard: ${title}`,
        text: shareText,
        url: shareUrl,
      }).catch((err) => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    }
  };
  
  return (
    <div className="fixed right-0 top-0 h-full w-96 z-50 animate-in slide-in-from-right duration-300">
      <div className="absolute inset-0 bg-white shadow-xl">
        <div className="h-full overflow-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <h2 className="text-xl font-serif font-semibold text-black">Tombstone Details</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Profile Section */}
            <div className="flex items-center gap-4">
          <img 
            src={avatar_url} 
            alt={username} 
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
          />
          <div>
                <h3 className="text-lg font-medium text-black">{twitter_handle}</h3>
            <p className="text-gray-600 text-sm">{username}</p>
          </div>
        </div>
        
            {/* Tombstone Info */}
            <div className="space-y-4">
          <div>
                <h3 className="text-2xl font-serif font-semibold text-black mb-2">
              R.I.P.
            </h3>
            <p className="text-xl font-medium text-gray-800">"{title}"</p>
          </div>
          
          <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
            <p className="text-gray-700 italic">"{description}"</p>
          </div>
          
          <p className="text-sm text-gray-500">
            Laid to rest on {formattedDate}
          </p>
        </div>
        
            {/* Actions */}
            <div className="space-y-3">
            <Button 
              onClick={handleShare}
              variant="secondary"
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800"
            >
                Share this memorial
            </Button>
            
            {promo_url && (
              <Button 
                onClick={() => window.open(promo_url, '_blank')}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white"
              >
                  Visit Project Link
              </Button>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
