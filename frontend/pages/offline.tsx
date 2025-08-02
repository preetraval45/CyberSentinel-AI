import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">📡</div>
          <CardTitle>You're Offline</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            No internet connection detected. Some features may be limited.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Available offline:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Cached training materials</li>
              <li>• Previously viewed scenarios</li>
              <li>• Help documentation</li>
            </ul>
          </div>
          <Button onClick={handleRetry} className="w-full">
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}