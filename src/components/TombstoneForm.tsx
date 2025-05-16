import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { getTwitterProfile } from '@/lib/twitter';
import { openPaddleCheckout, type TombstonePaymentData } from '@/lib/paddle';
import { createTombstone } from '@/lib/supabase';

interface LoadingStates {
  profileFetch: boolean;
  payment: boolean;
  databaseUpdate: boolean;
}

export type TombstoneFormData = {
  twitter_handle: string;
  username: string;
  avatar_url: string;
  title: string;
  description: string;
  promo_url?: string;
  email: string;
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
    promo_url: '',
    email: ''
  });
  
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    profileFetch: false,
    payment: false,
    databaseUpdate: false
  });
  
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing'>('form');
  
  const isLoading = Object.values(loadingStates).some(Boolean);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleTwitterHandleBlur = async () => {
    if (!formData.twitter_handle || loadingStates.profileFetch) return;

    try {
      setLoadingStates(prev => ({ ...prev, profileFetch: true }));
      const handle = formData.twitter_handle.replace('@', '');
      console.log(handle,"handle");
      const profile = await getTwitterProfile(handle);
      
    if (profile) {
      setFormData({
        ...formData,
        twitter_handle: profile.username,
        username: profile.name,
        avatar_url: profile.avatar_url
      });
      
        toast.success("Profile found!", {
          description: "Username and avatar populated from Twitter"
      });
      } else {
      toast.error("Profile not found", {
        description: "Please check your Twitter handle and try again"
      });
    }
    } catch (error) {
      toast.error("Error fetching profile", {
        description: "Please try again later"
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, profileFetch: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[TombstoneForm] handleSubmit called');
    
    // Prevent multiple submissions
    if (isLoading) return;
    
    // Validation
    if (!formData.twitter_handle || !formData.title || !formData.description || !formData.email) {
      toast.error("Missing required fields", {
        description: "Please fill in all required fields, including email"
      });
      return;
    }
    
    // Email format validation (simple regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email format", {
        description: "Please enter a valid email address"
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
    
    setLoadingStates(prev => ({ ...prev, payment: true }));
    setPaymentStep('processing');
    
    // Process payment with Paddle
    try {
      const paymentData: TombstonePaymentData = {
        title: formData.title,
        twitter_handle: formData.twitter_handle,
        description: formData.description,
        promo_url: formData.promo_url,
        email: formData.email
      };
      console.log('[TombstoneForm] paymentData for Paddle:', paymentData);

      await openPaddleCheckout({
        paymentData,
        successCallback: async (transactionId) => {
          console.log('[TombstoneForm] Paddle successCallback, transactionId:', transactionId);
          try {
            setLoadingStates(prev => ({ ...prev, databaseUpdate: true }));
    
            const tombstoneDataForDb = {
              ...formData,
              ...position,
              transaction_id: transactionId,
              payment_status: 'completed' as 'completed' | 'pending' | 'failed'
            };
            console.log('[TombstoneForm] Data for createTombstone:', tombstoneDataForDb);
            // Create tombstone with transaction ID
            const newTombstone = await createTombstone(tombstoneDataForDb);
            console.log('[TombstoneForm] newTombstone from DB:', newTombstone);

            if (!newTombstone) {
              throw new Error('Failed to create tombstone');
            }

            // Submit to parent component for UI update
            onSubmit({
              ...formData,
              ...position,
            });
            
            toast.success("Payment successful!", {
              description: "Your tombstone has been created"
            });
            
            onClose();
          } catch (error) {
            console.error('[TombstoneForm] Error creating tombstone in DB:', error);
            if (error instanceof Error) {
              if (error.message === 'User already has a tombstone') {
                toast.error("You already have a tombstone", {
                  description: "Each Twitter handle can only have one tombstone"
                });
              } else if (error.message === 'Position is already taken') {
                toast.error("Position is taken", {
                  description: "Please try placing your tombstone in a different location"
                });
              } else {
                toast.error("Failed to create tombstone", {
                  description: "Payment successful but tombstone creation failed. Please contact support."
                });
              }
            }
          } finally {
            setLoadingStates(prev => ({ ...prev, databaseUpdate: false }));
          }
        },
        errorCallback: (error) => {
          console.error('[TombstoneForm] Paddle errorCallback:', error);
          toast.error("Payment failed", {
            description: error.message || "Please try again later"
          });
          setPaymentStep('form');
        },
        closeCallback: () => {
          console.log('[TombstoneForm] Paddle closeCallback triggered');
          setLoadingStates(prev => ({ ...prev, payment: false }));
          setPaymentStep('form');
        }
      });
    } catch (error) {
      console.error('[TombstoneForm] Error initiating payment process:', error);
      toast.error("Payment initialization failed", {
        description: "Please try again later"
      });
      setLoadingStates(prev => ({ ...prev, payment: false }));
      setPaymentStep('form');
    }
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
        </div>
        
        {paymentStep === 'processing' ? (
          <div className="space-y-4 text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-gray-300 border-t-gray-800 rounded-full mx-auto"></div>
            <p className="text-gray-600">Processing your payment...</p>
            <p className="text-sm text-gray-500">Please complete the payment in the Paddle checkout window</p>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="twitter_handle" className="block text-sm font-medium text-muted-foreground">
              Twitter Handle (e.g., @username)
            </label>
            <Input
              type="text"
              name="twitter_handle"
              id="twitter_handle"
              value={formData.twitter_handle}
              onChange={handleChange}
              onBlur={handleTwitterHandleBlur}
              placeholder="@username"
              className="mt-1"
              disabled={loadingStates.profileFetch || isLoading}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-muted-foreground">
              Email Address (for receipt)
            </label>
            <Input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="mt-1"
              disabled={isLoading}
              required
            />
          </div>

          

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-muted-foreground">
              Title
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              maxLength={30}
              className="bg-white border-gray-300 text-black"
              disabled={isLoading}
              required
            />
            <p className="text-xs text-gray-500 text-right">
              {formData.title.length}/30
            </p>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-muted-foreground">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              maxLength={140}
              className="bg-white border-gray-300 text-black h-24"
              disabled={isLoading}
              required
            />
            <p className="text-xs text-gray-500 text-right">
              {formData.description.length}/140
            </p>
          </div>

          <div>
            <label htmlFor="promo_url" className="block text-sm font-medium text-muted-foreground">
              Promo URL (optional)
            </label>
            <Input
              id="promo_url"
              name="promo_url"
              value={formData.promo_url}
              onChange={handleChange}
              className="bg-white border-gray-300 text-black"
              disabled={isLoading}
              type="url"
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
          </div>
        </form>
        )}
      </div>
    </div>
  );
};
