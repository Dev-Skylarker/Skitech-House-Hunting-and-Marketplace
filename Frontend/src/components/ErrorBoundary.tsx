import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // In production, you could send error to logging service
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback 
        error={this.state.error} 
        errorInfo={this.state.errorInfo} 
        onReset={this.handleReset} 
      />;
    }

    return this.props.children;
  }
}

function ErrorFallback({ error, errorInfo, onReset }: { 
  error?: Error, 
  errorInfo?: ErrorInfo, 
  onReset: () => void 
}) {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
    onReset();
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-none shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-xl">Something went wrong</CardTitle>
          <CardDescription>
            We're sorry, but something unexpected happened. The error has been logged and we'll look into it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {process.env.NODE_ENV === 'development' && error && (
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-xs font-mono text-red-600 break-words">
                {error.toString()}
              </p>
              {errorInfo && (
                <details className="mt-2">
                  <summary className="text-xs font-mono text-muted-foreground cursor-pointer">
                    Component Stack
                  </summary>
                  <pre className="text-xs font-mono text-muted-foreground mt-1 whitespace-pre-wrap break-words">
                    {errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
          )}
          
          <div className="flex gap-2">
            <Button 
              onClick={handleGoHome}
              className="flex-1"
              variant="outline"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
            <Button 
              onClick={onReset}
              className="flex-1 bg-[#0F3D91] hover:bg-[#0F3D91]/90"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Higher-order component for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

export default ErrorBoundary;
