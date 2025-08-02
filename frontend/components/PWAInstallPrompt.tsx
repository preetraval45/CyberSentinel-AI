import { usePWA } from '@/hooks/usePWA';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function PWAInstallPrompt() {
  const { isInstallable, installApp } = usePWA();

  if (!isInstallable) return null;

  return (
    <Card className="fixed bottom-4 left-4 w-80 bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📱</span>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">Install CyberSentinel</h3>
            <p className="text-xs text-gray-600">Get the app for offline training</p>
          </div>
          <Button size="sm" onClick={installApp}>
            Install
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}