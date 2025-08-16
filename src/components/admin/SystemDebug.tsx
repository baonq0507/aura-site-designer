import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSystemContext } from '@/contexts/SystemContext';

const SystemDebug = () => {
  const { systemStatus, isLoading, error } = useSystemContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Debug Info</CardTitle>
        <CardDescription>Thông tin debug về trạng thái hệ thống</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <strong>Loading:</strong> {isLoading ? 'true' : 'false'}
          </div>
          <div>
            <strong>Error:</strong> {error || 'none'}
          </div>
          <div>
            <strong>System Status:</strong>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-sm">
              {JSON.stringify(systemStatus, null, 2)}
            </pre>
          </div>
          <div>
            <strong>is_enabled:</strong> {systemStatus?.is_enabled ? 'true' : 'false'}
          </div>
          <div>
            <strong>maintenance_message:</strong> {systemStatus?.maintenance_message || 'none'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemDebug;
