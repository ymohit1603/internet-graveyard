import { initializePaddle, Paddle } from '@paddle/paddle-js';
import { env } from '@/env';

// Initialize Paddle
export const initPaddle = async () => {
  const paddleInstance = await initializePaddle({
    environment: env.PADDLE_ENVIRONMENT,
    token: env.PADDLE_TOKEN,
  });
  return paddleInstance;
};

// Handle Paddle events
function handlePaddleEvent(event: any) {
  switch (event.name) {
    case 'checkout.completed':
      // You can handle successful payments here if needed
      break;
    case 'checkout.closed':
      // Handle closed checkout
      break;
  }
}

export interface PaddleCheckoutOptions {
  title: string;
  successCallback: (transactionId: string) => void;
  errorCallback: (error: Error) => void;
}

interface CheckoutCompleteEvent {
  transactionId: string;
}

interface CheckoutErrorEvent {
  message: string;
}

export async function openPaddleCheckout({ 
  title, 
  successCallback, 
  errorCallback 
}: PaddleCheckoutOptions) {
  try {
    const paddle = await initPaddle();
    if (!paddle) {
      throw new Error('Failed to initialize Paddle');
    }

    // Initialize Paddle checkout
    const checkout = await paddle.Checkout.open({
      settings: {
        displayMode: 'overlay',
        theme: 'dark',
        locale: 'en',
        successUrl: `${window.location.origin}/success`,
      },
      items: [
        {
          priceId: env.PADDLE_PRICE_ID,
          quantity: 1,
        },
      ],
      customer: {
        email: '',
      },
      customData: {
        tombstoneTitle: title,
      },
    });

    // Handle successful payment
    checkout.on('complete', (event: CheckoutCompleteEvent) => {
      successCallback(event.transactionId);
    });

    // Handle errors
    checkout.on('error', (error: CheckoutErrorEvent) => {
      errorCallback(new Error(error.message));
    });

  } catch (error) {
    errorCallback(error instanceof Error ? error : new Error('Failed to open checkout'));
  }
} 