import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

// Demo data for the preview
const DEMO_DATA: TombstoneFormData = {
  twitter_handle: '@demo_user',
  username: 'Demo User',
  avatar_url: 'https://picsum.photos/id/1005/200',
  title: 'My Failed Startup',
  description: 'Spent 6 months building the next big thing. Turns out nobody wanted it. RIP $50k savings.',
  promo_url: 'https://example.com'
};

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
    username: '',
    avatar_url: '',
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

  const handleDemoClick = () => {
    setFormData(DEMO_DATA);
    toast.info("Demo data loaded!", {
      description: "Form filled with example data. Click 'Pay $1' to see how it looks!"
    });
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
    
    // Simulate payment processing
    setTimeout(() => {
      onSubmit({
        ...formData,
        ...position
      });
      
      setIsLoading(false);
      onClose();
      
      toast.success("Payment successful!", {
        description: "Your grave has been planted in the graveyard"
      });
    }, 1500);
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="tombstone-form w-full max-w-md p-6 z-10 animate-in fade-in slide-in-from-bottom-4 bg-white rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-serif text-black">Plant your grave!</h2>
            <p className="text-sm text-gray-600">Create a permanent memorial for just $1</p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleDemoClick}
            className="text-sm border-gray-300"
          >
            Try Demo
          </Button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="twitter_handle" className="text-sm text-gray-700">
                X Handle
              </label>
              <Input
                id="twitter_handle"
                name="twitter_handle"
                placeholder="@username"
                value={formData.twitter_handle}
                onChange={handleChange}
                onBlur={handleTwitterHandleBlur}
                className="bg-white border-gray-300 text-black"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm text-gray-700">
                Title
              </label>
              <Input
                id="title"
                name="title"
                placeholder="Name your grave"
                value={formData.title}
                onChange={handleChange}
                maxLength={30}
                className="bg-white border-gray-300 text-black"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm text-gray-700">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                placeholder="Tell us about your idea"
                value={formData.description}
                onChange={handleChange}
                maxLength={140}
                className="bg-white border-gray-300 text-black h-24"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="promo_url" className="text-sm text-gray-700">
                Link
              </label>
              <Input
                id="promo_url"
                name="promo_url"
                placeholder="https://example.com"
                value={formData.promo_url}
                onChange={handleChange}
                className="bg-white border-gray-300 text-black"
              />
            </div>
            
            <div className="pt-4 space-y-2">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white"
              >
                {isLoading ? "Processing..." : "Pay $1 to Plant Grave"}
              </Button>
              <p className="text-xs text-center text-gray-500">
                Secure payment processed via Stripe
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
