// src/lib/paddle.ts
import { initializePaddle, Paddle } from '@paddle/paddle-js';
import { env } from '@/env';

let paddleInstance: Paddle | null = null;

// Define base event type since it's not exported from paddle-js
interface PaddleEvent<T extends string> {
  name: T;
  [key: string]: any;
}

// Define proper types for Paddle events
interface PaddleCheckoutComplete extends PaddleEvent<'checkout.complete'> {
  transaction_id: string;
}

interface PaddleCheckoutError extends PaddleEvent<'checkout.error'> {
  message: string;
}

type PaddleCheckoutClose = PaddleEvent<'checkout.close'>;

// Store for active checkout sessions
interface CheckoutSession {
  successCallback: (txnId: string) => Promise<void>;
  errorCallback: (err: Error) => void;
  closeCallback?: () => void;
}

const activeCheckouts = new Map<string, CheckoutSession>();

/** Centralized event handler with proper type checking */
function handlePaddleEvent(event: PaddleEvent<any>) {
  // Get all active checkout sessions
  const sessions = Array.from(activeCheckouts.values());

  switch (event.name) {
    case 'checkout.complete':
      const completeEvent = event as PaddleCheckoutComplete;
      sessions.forEach(session => {
        session.successCallback(completeEvent.transaction_id).catch(err => {
          console.error('Error in success callback:', err);
        });
      });
      // Clear all sessions after successful completion
      activeCheckouts.clear();
      break;

    case 'checkout.error':
      const errorEvent = event as PaddleCheckoutError;
      sessions.forEach(session => {
        session.errorCallback(new Error(errorEvent.message));
      });
      break;

    case 'checkout.close':
      sessions.forEach(session => {
        session.closeCallback?.();
      });
      // Clear the specific checkout session that was closed
      // Note: In a real implementation, you might want to match this with a specific checkout ID
      activeCheckouts.clear();
      break;
  }
}

/** Initialize or update Paddle.js on the page */
export async function initPaddle(): Promise<Paddle> {
  try {
    if (paddleInstance) {
      // Update to pick up any new event handler
      paddleInstance.Update({ eventCallback: handlePaddleEvent });
      return paddleInstance;
    }

    if (!env.PADDLE_TOKEN || !env.PADDLE_ENVIRONMENT) {
      throw new Error('Missing required Paddle configuration');
    }

    paddleInstance = await initializePaddle({
      environment: env.PADDLE_ENVIRONMENT,
      token: env.PADDLE_TOKEN,
      eventCallback: handlePaddleEvent,
    });

    return paddleInstance;
  } catch (error) {
    console.error('Failed to initialize Paddle:', error);
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

/** Open the checkout overlay and wire up callbacks via the event store */
export async function openPaddleCheckout({ 
  paymentData,
  successCallback, 
  errorCallback,
  closeCallback,
}: PaddleCheckoutOptions): Promise<void> {
  try {
    const paddle = await initPaddle();

    if (!env.PADDLE_PRICE_ID) {
      throw new Error('Missing Paddle price ID configuration');
    }

    // Generate a unique session ID for this checkout
    const sessionId = `checkout-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Store the callbacks for this checkout session
    activeCheckouts.set(sessionId, {
      successCallback,
      errorCallback,
      closeCallback,
    });

    // Cleanup function to remove callbacks after a timeout
    const cleanup = () => {
      activeCheckouts.delete(sessionId);
    };

    // Auto-cleanup after 1 hour (maximum reasonable checkout time)
    setTimeout(cleanup, 60 * 60 * 1000);

    // Validate required fields
    if (!paymentData.title || !paymentData.twitter_handle || !paymentData.description) {
      throw new Error('Missing required payment data fields');
    }

    // Open the checkout
    await paddle.Checkout.open({
      settings: {
        displayMode: 'overlay',
        theme: 'dark',
        locale: 'en',
        successUrl: `${window.location.origin}/success`,
        frameTarget: 'checkout-container',
        frameStyle: 'width:100%;min-width:312px;background:transparent;border:none;',
      },
      items: [
        {
          priceId: env.PADDLE_PRICE_ID,
          quantity: 1 
        },
      ],
      customer: {
        email: paymentData.email || '',
      },
      customData: {
        tombstoneTitle: paymentData.title,
        twitterHandle: paymentData.twitter_handle,
        description: paymentData.description,
        promoUrl: paymentData.promo_url || '',
        sessionId, // Include the session ID in custom data
      },
    });
  } catch (err) {
    console.error('Error opening Paddle checkout:', err);
    errorCallback(err instanceof Error ? err : new Error('Failed to open checkout'));
  }
}
