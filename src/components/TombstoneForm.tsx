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
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTwitterHandleBlur = async () => {
    if (!formData.twitter_handle || loadingStates.profileFetch) return;
    try {
      setLoadingStates(s => ({ ...s, profileFetch: true }));
      const handle = formData.twitter_handle.replace('@', '');
      const profile = await getTwitterProfile(handle);
      if (profile) {
        setFormData(s => ({
          ...s,
          twitter_handle: profile.username,
          username: profile.name,
          avatar_url: profile.avatar_url
        }));
        toast.success('Profile found!', { description: 'Auto-filled from Twitter.' });
      } else {
        toast.error('Profile not found', { description: 'Double-check your handle.' });
      }
    } catch {
      toast.error('Error fetching profile', { description: 'Please try again later.' });
    } finally {
      setLoadingStates(s => ({ ...s, profileFetch: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    // Basic validation…
    if (!formData.twitter_handle || !formData.title || !formData.description || !formData.email) {
      return toast.error('All required fields must be filled.');
    }
    setLoadingStates(s => ({ ...s, payment: true }));
    setPaymentStep('processing');

    const paymentData: TombstonePaymentData = {
      title: formData.title,
      twitter_handle: formData.twitter_handle,
      description: formData.description,
      promo_url: formData.promo_url,
      email: formData.email
    };

    try {
      await openPaddleCheckout({
        paymentData,
        successCallback: async (transactionId) => {
          setLoadingStates(s => ({ ...s, databaseUpdate: true }));
          try {
            const tombstoneData = {
              ...formData,
              ...position,
              transaction_id: transactionId,
              payment_status: 'completed' as const
            };
            const newTombstone = await createTombstone(tombstoneData);
            if (!newTombstone) throw new Error('DB insert failed');
            onSubmit({ ...formData, ...position });
            toast.success('Success!', { description: 'Your memorial is live.' });
            onClose();
          } catch (err: any) {
            toast.error('Saving failed', { description: err.message });
          } finally {
            setLoadingStates(s => ({ ...s, databaseUpdate: false }));
          }
        },
        errorCallback: (err) => {
          toast.error('Payment failed', { description: err.message });
          setPaymentStep('form');
          setLoadingStates(s => ({ ...s, payment: false }));
        },
        closeCallback: () => {
          setPaymentStep('form');
          setLoadingStates(s => ({ ...s, payment: false }));
        }
      });
    } catch {
      toast.error('Payment init failed', { description: 'Try again later.' });
      setPaymentStep('form');
      setLoadingStates(s => ({ ...s, payment: false }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-serif font-bold text-gray-900">
              Plant Your Memorial
            </h2>
            
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            &times;
          </Button>
        </div>

        {paymentStep === 'processing' ? (
          <div className="p-8 text-center space-y-4">
            <div className="mx-auto w-10 h-10 border-4 border-gray-300 border-t-purple-600 rounded-full animate-spin"></div>
            <p className="text-gray-600">Processing payment…</p>
            <p className="text-xs text-gray-400">Complete the checkout in the popup.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/** Twitter Handle **/}
            <div>
              <label className="block text-sm font-medium text-gray-700">Twitter Handle</label>
              <Input
                name="twitter_handle"
                value={formData.twitter_handle}
                onChange={handleChange}
                onBlur={handleTwitterHandleBlur}
                placeholder="your X handle"
                disabled={isLoading}
                className="mt-1 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>

            {/** Email **/}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                disabled={isLoading}
                className="mt-1 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>

            {/** Title **/}
            <div>
              <label className="block text-sm font-medium text-gray-700">Name of the Idea</label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                maxLength={30}
                disabled={isLoading}
                className="mt-1 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                required
              />
              <p className="mt-1 text-xs text-gray-400 text-right">
                {formData.title.length}/30
              </p>
            </div>

            {/** Description **/}
            <div>
              <label className="block text-sm font-medium text-gray-700">About the Idea</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                maxLength={140}
                disabled={isLoading}
                className="mt-1 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 h-24"
                required
              />
              <p className="mt-1 text-xs text-gray-400 text-right">
                {formData.description.length}/140
              </p>
            </div>

            {/** Promo URL (optional) **/}
            <div>
              <label className="block text-sm font-medium text-gray-700">Promotion URL (optional)</label>
              <Input
                name="promo_url"
                value={formData.promo_url}
                onChange={handleChange}
                disabled={isLoading}
                className="mt-1 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                type="url"
              />
            </div>

            {/** Submit **/}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow"
            >
              {isLoading ? 'Submitting…' : 'Pay $9.99 '}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
