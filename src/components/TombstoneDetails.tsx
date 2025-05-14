import { Button } from '@/components/ui/button';
import { TombstoneProps } from './Tombstone';

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
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="tombstone-details w-full max-w-md p-6 z-10 animate-in fade-in zoom-in duration-300 bg-white rounded-lg shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <img 
            src={avatar_url} 
            alt={username} 
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
          />
          <div>
            <h2 className="text-xl font-medium text-black">{twitter_handle}</h2>
            <p className="text-gray-600 text-sm">{username}</p>
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
          <div>
            <h3 className="text-2xl font-serif font-semibold text-black">
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
        
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Close
          </Button>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleShare}
              variant="secondary"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800"
            >
              Share
            </Button>
            
            {promo_url && (
              <Button 
                onClick={() => window.open(promo_url, '_blank')}
                className="bg-gray-800 hover:bg-gray-700 text-white"
              >
                Visit Link
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
