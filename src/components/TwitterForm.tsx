import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getTwitterProfile, type TwitterProfile } from '@/lib/twitter';
import { createTombstone, getTombstoneByTwitterHandle } from '@/lib/supabase';
import { openPaddleCheckout } from '@/lib/paddle';
import type { Tombstone } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

interface TwitterFormProps {
  onProfileFetched: (profile: TwitterProfile & Pick<Tombstone, 'x' | 'y' | 'z'>) => void;
  className?: string;
}

export function TwitterForm({ onProfileFetched, className }: TwitterFormProps) {
  const [handle, setHandle] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [promoUrl, setPromoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'twitter' | 'details' | 'payment'>('twitter');
  const [twitterProfile, setTwitterProfile] = useState<TwitterProfile | null>(null);
  const { toast } = useToast();

  const handleTwitterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Check if tombstone already exists
      const existingTombstone = await getTombstoneByTwitterHandle(handle.replace('@', ''));
      if (existingTombstone) {
        setError('This Twitter handle already has a tombstone');
        return;
      }

      const profile = await getTwitterProfile(handle.replace('@', ''));
      if (!profile) {
        setError('Twitter profile not found');
        return;
      }

      setTwitterProfile(profile);
      setStep('details');
    } catch (err) {
      setError('Failed to fetch Twitter profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!twitterProfile) {
        setError('Twitter profile not found');
        return;
      }

      setStep('payment');
      
      // Open Paddle checkout
      await openPaddleCheckout({
        title,
        successCallback: async (transactionId) => {
          try {
            // Generate random position for the tombstone
            const position = {
              x: Math.random() * 20 - 10, // -10 to 10
              y: 0,
              z: Math.random() * 20 - 10, // -10 to 10
            };

            const tombstone = await createTombstone({
              ...position,
              twitter_handle: twitterProfile.username,
              username: twitterProfile.username,
              avatar_url: twitterProfile.profileImageUrl,
              title,
              description,
              promo_url: promoUrl || undefined,
            });

            if (!tombstone) {
              toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to create tombstone after payment",
              });
              return;
            }

            onProfileFetched({
              ...twitterProfile,
              ...position,
            });

            toast({
              title: "Success",
              description: "Your tombstone has been created!",
            });
          } catch (err) {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to create tombstone after payment",
            });
          }
        },
        errorCallback: (error) => {
          toast({
            variant: "destructive",
            title: "Payment Failed",
            description: error.message,
          });
          setStep('details');
          setLoading(false);
        },
      });
    } catch (err) {
      setError('Failed to process payment');
      setLoading(false);
    }
  };

  if (step === 'payment') {
    return (
      <div className={className}>
        <div className="space-y-4 text-center">
          <h2 className="text-2xl font-serif text-foreground">Processing Payment</h2>
          <p className="text-sm text-muted-foreground">
            Please complete the payment to create your tombstone
          </p>
        </div>
      </div>
    );
  }

  if (step === 'details') {
    return (
      <form onSubmit={handleDetailsSubmit} className={className}>
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-serif text-foreground">Tombstone Details</h2>
            <p className="text-sm text-muted-foreground">
              Add details to your digital tombstone
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-foreground">
                Title (max 30 characters)
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={30}
                placeholder="e.g., Beloved Developer"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-foreground">
                Description (max 140 characters)
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={140}
                placeholder="Share your legacy..."
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="promoUrl" className="text-sm font-medium text-foreground">
                Promotional URL (optional)
              </label>
              <Input
                id="promoUrl"
                type="url"
                value={promoUrl}
                onChange={(e) => setPromoUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep('twitter')}
              disabled={loading}
            >
              Back
            </Button>
            <Button type="submit" disabled={!title || !description || loading}>
              {loading ? 'Processing...' : 'Continue to Payment'}
            </Button>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleTwitterSubmit} className={className}>
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-serif text-foreground">Enter Twitter Handle</h2>
          <p className="text-sm text-muted-foreground">
            Enter a Twitter handle to create their digital tombstone
          </p>
        </div>

        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="@username"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            className="font-mono"
            required
          />
          <Button type="submit" disabled={!handle || loading}>
            {loading ? 'Checking...' : 'Next'}
          </Button>
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    </form>
  );
} 