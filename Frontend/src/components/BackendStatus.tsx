import { useState, useEffect } from 'react';
import { apiService } from '@/services/apiService';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Server, AlertCircle } from 'lucide-react';

interface BackendStatusProps {
  className?: string;
}

export function BackendStatus({ className }: BackendStatusProps) {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await apiService.health();
        if (response.success) {
          setStatus('online');
        } else {
          setStatus('offline');
        }
      } catch (error) {
        setStatus('offline');
      }
      setLastChecked(new Date());
    };

    // Check immediately
    checkBackend();

    // Check every 30 seconds
    const interval = setInterval(checkBackend, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <AlertCircle className="w-3 h-3 animate-pulse" />;
      case 'online':
        return <Wifi className="w-3 h-3" />;
      case 'offline':
        return <WifiOff className="w-3 h-3" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'checking':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'online':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'offline':
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'checking':
        return 'Checking...';
      case 'online':
        return 'Backend Online';
      case 'offline':
        return 'Backend Offline';
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge className={`flex items-center gap-1 ${getStatusColor()}`}>
        <Server className="w-3 h-3" />
        {getStatusIcon()}
        <span className="text-xs font-medium">{getStatusText()}</span>
      </Badge>
      {lastChecked && (
        <span className="text-xs text-muted-foreground">
          {lastChecked.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}
