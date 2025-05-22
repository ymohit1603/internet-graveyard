// PayPalModal.tsx
import React, { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { createTombstone } from '@/lib/supabase';

interface PayPalModalProps {
  open: boolean;
  onClose: () => void;
  formData: {
    twitter_handle: string;
    username: string;
    avatar_url: string;
    title: string;
    description: string;
    x: number;
    y: number;
    z: number;
    promo_url?: string;
  };
  onPaymentSuccess?: () => void;
}

const CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8787";

const initialOptions = {
  "client-id": CLIENT_ID!,
  clientId: CLIENT_ID!,
  currency: "USD",
  "enable-funding": "venmo",
  "buyer-country": "US",
  components: "buttons",
};

const PayPalModal: React.FC<PayPalModalProps> = ({ open, onClose, formData, onPaymentSuccess }) => {
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (open) {
      setMessage(""); // Clear messages on open
    }
  }, [open]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isProcessing) onClose();
    };
    if (open) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, isProcessing, onClose]);

  if (!open) return null;

  const handleApiError = (error: any, context: string) => {
    console.error(context, error);
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    setMessage(`${context}: ${errorMessage}`);
    setIsProcessing(false);
  };

  const saveTombstone = async (transactionId: string) => {
    try {
      setMessage("Creating your memorial tombstone...");
      
      const tombstoneData = {
        ...formData,
        transaction_id: transactionId,
        payment_status: 'completed' as 'completed'
      };
      
      console.log("Creating tombstone with data:", tombstoneData);
      const result = await createTombstone(tombstoneData);
      
      if (!result) {
        throw new Error("Failed to create tombstone in database");
      }
      
      setMessage("Your memorial tombstone has been created successfully!");
      if (onPaymentSuccess) onPaymentSuccess();
      
    } catch (error) {
      console.error("Error creating tombstone:", error);
      setMessage(`Payment was successful, but there was an error creating your memorial: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // Still call onPaymentSuccess to close modal or continue flow even if tombstone creation fails
      if (onPaymentSuccess) onPaymentSuccess();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => !isProcessing && onClose()}
      />
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-serif font-bold text-gray-900">Complete Payment</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => !isProcessing && onClose()}
            disabled={isProcessing}
            className="text-gray-400 hover:text-gray-600"
          >
            &times;
          </Button>
        </div>
        <div className="p-6 flex flex-col items-center justify-center w-full">
          {!CLIENT_ID ? (
            <p>PayPal Client ID not configured.</p>
          ) : (
            <PayPalScriptProvider options={initialOptions}>
              <PayPalButtons
                style={{ shape: "rect", layout: "vertical", color: "gold", label: "paypal" }}
                disabled={isProcessing}
                createOrder={async () => {
                  setMessage("Initiating checkout...");
                  setIsProcessing(true);
                  try {
                    const res = await fetch(`${API_BASE}/api/orders`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        cart: [{
                          id: "MEMORIAL_PRODUCT_01",
                          quantity: 1, // number type, not string
                          description: "Plant a Memorial",
                        }],
                      }),
                    });

                    if (!res.ok) {
                      let errorPayload: any = { message: `Server error: ${res.status}` };
                      try {
                        errorPayload = await res.json();
                      } catch (_) {}
                      throw new Error(errorPayload.details || errorPayload.message);
                    }

                    const data = await res.json();
                    setMessage("Order created. Proceed to PayPal.");
                    setIsProcessing(false);
                    return data.id;
                  } catch (error) {
                    handleApiError(error, "Failed to create order");
                    throw error;
                  }
                }}
                onApprove={async (data, actions) => {
                  setMessage("Processing payment...");
                  setIsProcessing(true);
                  console.log("PayPal onApprove data:", data);
                  
                  try {
                    const response = await fetch(`${API_BASE}/api/orders/${data.orderID}/capture`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                    });

                    console.log("Capture response status:", response.status);
                    const responseText = await response.text();
                    console.log("Capture response text:", responseText);
                    
                    let orderData;
                    try {
                      orderData = JSON.parse(responseText);
                      console.log("Parsed order data:", orderData);
                    } catch (e) {
                      console.error("Failed to parse response as JSON:", e);
                      throw new Error(`Invalid response format: ${responseText.substring(0, 100)}`);
                    }

                    if (!response.ok) {
                      throw new Error(orderData?.details || orderData?.error || `Server error: ${response.status}`);
                    }

                    const errorDetail = orderData?.details?.[0];

                    if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                      setMessage("Payment declined. Please try another payment method or contact support.");
                      setIsProcessing(false);
                      return actions.restart(); 
                    } else if (errorDetail) {
                      throw new Error(`${errorDetail.description} (${orderData.debug_id || 'N/A'})`);
                    } else if (orderData.id && orderData.status === 'COMPLETED') {
                      // Look for transaction in different response formats
                      const transaction = 
                        orderData.purchase_units?.[0]?.payments?.captures?.[0] || 
                        orderData.purchaseUnits?.[0]?.payments?.captures?.[0];
                      
                      if (transaction) {
                        setMessage(`Transaction ${transaction.status}: ${transaction.id}. Creating your memorial...`);
                        console.log("Capture result", orderData, transaction);
                        
                        // Save the tombstone with the transaction ID
                        await saveTombstone(transaction.id);
                      } else {
                        setMessage(`Payment completed! Creating your memorial...`);
                        console.log("Capture successful but no transaction details found:", orderData);
                        
                        // Save the tombstone with the order ID as fallback
                        await saveTombstone(orderData.id);
                      }
                    } else {
                       throw new Error(orderData.details || orderData.error || 'Payment capture did not complete successfully.');
                    }
                  } catch (error) {
                    handleApiError(error, "Sorry, your transaction could not be processed");
                  } finally {
                    if (!message.includes("Transaction") && !message.includes("Payment completed")) {
                        setIsProcessing(false); 
                    }
                  }
                }}
                onError={(err) => {
                  console.error("PayPal error:", err);
                  setMessage(`PayPal error: ${err.toString()}`);
                  setIsProcessing(false);
                }}
              />
            </PayPalScriptProvider>
          )}
          {isProcessing && (
            <div className="mt-4 animate-pulse text-sm text-gray-500">Processing...</div>
          )}
          {message && (
            <p
              className={`mt-4 text-sm text-center ${
                /declined|failed|error/i.test(message)
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayPalModal;
