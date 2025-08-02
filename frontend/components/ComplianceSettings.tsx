import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

export default function ComplianceSettings() {
  const [settings, setSettings] = useState({
    gdpr_enabled: true,
    hipaa_enabled: false,
    data_retention_days: 365
  });
  const [exporting, setExporting] = useState<string | null>(null);

  const exportData = async (type: string) => {
    setExporting(type);
    try {
      const response = await fetch('/api/sso/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          export_type: type,
          user_id: type === 'gdpr' ? 123 : undefined
        })
      });
      
      const data = await response.json();
      if (data.success) {
        // Download file or show success message
        alert(`Export completed: ${data.file_path}`);
      }
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Compliance Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">GDPR Compliance</h3>
              <p className="text-sm text-gray-600">Enable GDPR data protection features</p>
            </div>
            <Switch 
              checked={settings.gdpr_enabled}
              onCheckedChange={(checked) => setSettings({...settings, gdpr_enabled: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">HIPAA Compliance</h3>
              <p className="text-sm text-gray-600">Enable HIPAA healthcare data protection</p>
            </div>
            <Switch 
              checked={settings.hipaa_enabled}
              onCheckedChange={(checked) => setSettings({...settings, hipaa_enabled: checked})}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Exports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="outline" 
            onClick={() => exportData('gdpr')}
            disabled={exporting === 'gdpr'}
            className="w-full"
          >
            {exporting === 'gdpr' ? 'Exporting...' : 'Export GDPR Data'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => exportData('audit')}
            disabled={exporting === 'audit'}
            className="w-full"
          >
            {exporting === 'audit' ? 'Exporting...' : 'Export Audit Logs'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}