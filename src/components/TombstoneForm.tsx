
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export type TombstoneFormData = {
  twitter_handle: string;
  username: string;
  avatar_url: string;
  title: string;
  description: string;
  promo_url?: string;
};

type TombstoneFormProps = {
  position: { x: number; y: number; z: number };
  onClose: () => void;
  onSubmit: (data: TombstoneFormData & { x: number; y: number; z: number }) => void;
};

export const TombstoneForm = ({ position, onClose, onSubmit }: TombstoneFormProps) => {
  const [formData, setFormData] = useState<TombstoneFormData>({
    twitter_handle: '',
    username: '', // This would be auto-populated from Twitter API
    avatar_url: '', // This would be auto-populated from Twitter API
    title: '',
    description: '',
    promo_url: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleTwitterHandleBlur = async () => {
    // In a real implementation, you would fetch the Twitter profile
    // For the demo, we're just setting mock data
    if (formData.twitter_handle && !formData.username) {
      setFormData({
        ...formData,
        username: formData.twitter_handle.replace('@', ''),
        avatar_url: 'https://picsum.photos/200' // Placeholder
      });
      
      toast.info("Profile fetched!", {
        description: "Username and avatar populated from Twitter handle"
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.twitter_handle || !formData.title || !formData.description) {
      toast.error("Missing required fields", {
        description: "Please fill in all required fields"
      });
      return;
    }
    
    // Title length validation
    if (formData.title.length > 30) {
      toast.error("Title too long", {
        description: "Title must be 30 characters or less"
      });
      return;
    }
    
    // Description length validation
    if (formData.description.length > 140) {
      toast.error("Description too long", {
        description: "Description must be 140 characters or less"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onSubmit({
        ...formData,
        ...position
      });
      
      setIsLoading(false);
      onClose();
      
      toast.success("Tombstone created!", {
        description: "Your grave has been planted"
      });
    }, 1500);
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="tombstone-form w-full max-w-md p-6 z-10 animate-in fade-in slide-in-from-bottom-4">
        <h2 className="text-2xl font-serif text-white mb-6">Plant a Grave</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="twitter_handle" className="text-sm text-gray-300">
                Twitter Handle (X) *
              </label>
              <Input
                id="twitter_handle"
                name="twitter_handle"
                placeholder="@username"
                value={formData.twitter_handle}
                onChange={handleChange}
                onBlur={handleTwitterHandleBlur}
                className="bg-gray-800/60 border-gray-700"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm text-gray-300">
                Title of Idea Being "Graved" * <span className="text-xs text-gray-500">(max 30 chars)</span>
              </label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Web3 Social Platform"
                value={formData.title}
                onChange={handleChange}
                maxLength={30}
                className="bg-gray-800/60 border-gray-700"
                required
              />
              <div className="text-xs text-right text-gray-500">
                {formData.title.length}/30
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm text-gray-300">
                Description * <span className="text-xs text-gray-500">(max 140 chars)</span>
              </label>
              <Textarea
                id="description"
                name="description"
                placeholder="Why this idea failed or should be laid to rest..."
                value={formData.description}
                onChange={handleChange}
                maxLength={140}
                className="bg-gray-800/60 border-gray-700 h-24"
                required
              />
              <div className="text-xs text-right text-gray-500">
                {formData.description.length}/140
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="promo_url" className="text-sm text-gray-300">
                Promotional URL <span className="text-xs text-gray-500">(optional)</span>
              </label>
              <Input
                id="promo_url"
                name="promo_url"
                placeholder="https://your-new-thing.com"
                value={formData.promo_url}
                onChange={handleChange}
                className="bg-gray-800/60 border-gray-700"
              />
            </div>
            
            <div className="pt-4 flex justify-between items-center">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-purple-700 hover:bg-purple-600"
              >
                {isLoading ? "Processing..." : "Pay $1 & Plant Grave"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
