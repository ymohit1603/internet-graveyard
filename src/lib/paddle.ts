import { initializePaddle, Paddle } from '@paddle/paddle-js';
import { env } from '@/env';

let paddleInstance: Paddle | null = null;
console.log('[paddle.ts] Loaded with env:', env);

// Define base event type since it's not exported from paddle-js
interface PaddleEvent<T extends string> {
  name: T;
  [key: string]: any;
}

// Define Paddle event types
interface PaddleCheckoutComplete extends PaddleEvent<'checkout.complete'> {
  transaction_id: string;
}
interface PaddleCheckoutError extends PaddleEvent<'checkout.error'> {
  message: string;
}
type PaddleCheckoutClose = PaddleEvent<'checkout.close'>;

// Active checkout sessions
interface CheckoutSession {
  successCallback: (txnId: string) => Promise<void>;
  errorCallback: (err: Error) => void;
  closeCallback?: () => void;
}
const activeCheckouts = new Map<string, CheckoutSession>();

function handlePaddleEvent(event: PaddleEvent<any>) {
  const sessions = Array.from(activeCheckouts.values());
  console.log('[paddle.ts] handlePaddleEvent received:', event);

  switch (event.name) {
    case 'checkout.completed':
      console.log('[paddle.ts] ✅ checkout.completed event received:', event);
      sessions.forEach(session =>
        session.successCallback(event.data.transaction_id).catch(err =>
          console.error('[paddle.ts] ❌ Error in success callback:', err)
        )
      );
      activeCheckouts.clear();
      break;

    case 'checkout.error':
      console.log('[paddle.ts] ❌ checkout.error:', event);
      sessions.forEach(session =>
        session.errorCallback(new Error(event.message))
      );
      break;

    case 'checkout.close':
      console.log('[paddle.ts] ⚠️ checkout.close:', event);
      sessions.forEach(session => session.closeCallback?.());
      activeCheckouts.clear();
      break;
  }
}

export async function initPaddle(): Promise<Paddle> {
  console.log('[paddle.ts] initPaddle()', env);

  try {
    if (paddleInstance) {
      console.log('[paddle.ts] Updating existing Paddle instance');
      paddleInstance.Update({ eventCallback: handlePaddleEvent });
      return paddleInstance;
    }

    if (!env.PADDLE_TOKEN || !env.PADDLE_ENVIRONMENT) {
      throw new Error('❌ Missing Paddle configuration');
    }

    console.log('[paddle.ts] Initializing Paddle instance...');
    paddleInstance = await initializePaddle({
      environment: env.PADDLE_ENVIRONMENT,
      token: env.PADDLE_TOKEN,
      eventCallback: handlePaddleEvent,
    });

    console.log('[paddle.ts] ✅ Paddle initialized');
    return paddleInstance;
  } catch (error) {
    console.error('[paddle.ts] ❌ Failed to initialize Paddle:', error);
    throw new Error('Failed to initialize payment system');
  }
}

export interface TombstonePaymentData {
  title: string;
  twitter_handle: string;
  description: string;
  promo_url?: string;
  email?: string;
}

export interface PaddleCheckoutOptions {
  paymentData: TombstonePaymentData;
  successCallback: (transactionId: string) => Promise<void>;
  errorCallback: (error: Error) => void;
  closeCallback?: () => void;
}

export async function openPaddleCheckout({
  paymentData,
  successCallback,
  errorCallback,
  closeCallback,
}: PaddleCheckoutOptions): Promise<void> {
  console.log('[paddle.ts] openPaddleCheckout() called');
  console.log('[paddle.ts] Payment data:', paymentData);

  try {
    const paddle = await initPaddle();

    if (!env.PADDLE_PRICE_ID) {
      throw new Error('❌ Missing Paddle price ID configuration');
    }

    const sessionId = `checkout-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    activeCheckouts.set(sessionId, {
      successCallback,
      errorCallback,
      closeCallback,
    });

    setTimeout(() => activeCheckouts.delete(sessionId), 60 * 60 * 1000); // auto cleanup

    const customData = {
      tombstoneTitle: paymentData.title,
      twitterHandle: paymentData.twitter_handle,
      description: paymentData.description,
      promoUrl: paymentData.promo_url || '',
      sessionId,
    };

    try {
      JSON.stringify(customData); // ensure serializable
    } catch (err) {
      console.error('[paddle.ts] ❌ customData is not serializable:', err);
      throw new Error('Invalid custom data');
    }

    const checkoutArgs = {
      settings: {
        displayMode: 'overlay' as const,
        theme: 'dark' as const,
        locale: 'en' as const,
        // successUrl: `${window.location.origin}`,
        // ✅ frameTarget/frameStyle removed for overlay mode
      },
      items: [
        {
          priceId: env.PADDLE_PRICE_ID,
          quantity: 1,
        },
      ],
      customer: paymentData.email
        ? { email: paymentData.email }
        : undefined,
      customData,
    };

    console.log('[paddle.ts] ✅ Final checkoutArgs:', checkoutArgs);
    await paddle.Checkout.open(checkoutArgs);
  } catch (err) {
    console.error('[paddle.ts] ❌ openPaddleCheckout error:', err);
    errorCallback(err instanceof Error ? err : new Error('Unknown Paddle error'));
  }
}
