import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BillingPortalProps {
  customerId: string;
}

export default function BillingPortal({ customerId }: BillingPortalProps) {
  const [loading, setLoading] = useState(false);

  const openBillingPortal = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/billing/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customerId,
          return_url: window.location.origin + '/dashboard'
        })
      });
      const data = await response.json();
      window.location.href = data.portal_url;
    } catch (error) {
      console.error('Portal error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing & Subscription</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">
          Manage your subscription, update payment methods, and view invoices.
        </p>
        <Button onClick={openBillingPortal} disabled={loading}>
          {loading ? 'Opening...' : 'Manage Billing'}
        </Button>
      </CardContent>
    </Card>
  );
}