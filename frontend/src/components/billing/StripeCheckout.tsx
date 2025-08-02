'use client'

import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Lock } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({ priceId }: { priceId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)!,
    });

    if (!error) {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price_id: priceId, payment_method: paymentMethod.id }),
      });
      
      const { client_secret } = await response.json();
      
      const { error: confirmError } = await stripe.confirmCardPayment(client_secret);
      
      if (!confirmError) {
        window.location.href = '/dashboard?subscription=success';
      }
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex items-center space-x-2 mb-4">
          <CreditCard className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold">Payment Details</h3>
        </div>
        
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#ffffff',
                  '::placeholder': { color: '#9ca3af' },
                },
              },
            }}
          />
        </div>
      </div>
      
      <motion.button
        type="submit"
        disabled={!stripe || loading}
        className="neon-button w-full flex items-center justify-center space-x-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Lock className="w-4 h-4" />
        <span>{loading ? 'Processing...' : 'Subscribe Now'}</span>
      </motion.button>
    </form>
  );
}

export default function StripeCheckout({ priceId }: { priceId: string }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm priceId={priceId} />
    </Elements>
  );
}