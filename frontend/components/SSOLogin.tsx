import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ssoProviders = [
  { id: 'google', name: 'Google Workspace', icon: '🔍' },
  { id: 'azure', name: 'Azure AD', icon: '🔷' },
  { id: 'okta', name: 'Okta', icon: '🔐' }
];

export default function SSOLogin() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSSOLogin = async (provider: string) => {
    setLoading(provider);
    try {
      // In real implementation, redirect to SSO provider
      const token = 'mock_token_from_provider';
      const domain = window.location.hostname;
      
      const response = await fetch('/api/sso/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, token, domain })
      });
      
      const data = await response.json();
      if (data.success) {
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('SSO login error:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Enterprise Login</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {ssoProviders.map((provider) => (
          <Button
            key={provider.id}
            variant="outline"
            className="w-full justify-start"
            onClick={() => handleSSOLogin(provider.id)}
            disabled={loading === provider.id}
          >
            <span className="mr-2">{provider.icon}</span>
            {loading === provider.id ? 'Connecting...' : `Continue with ${provider.name}`}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}