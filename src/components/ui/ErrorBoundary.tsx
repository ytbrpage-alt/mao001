// src/components/ui/ErrorBoundary.tsx
// React Error Boundary component

'use client';

import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.props.onError?.(error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-danger-100 flex items-center justify-center mb-4">
                        <AlertTriangle className="w-8 h-8 text-danger-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                        Algo deu errado
                    </h3>
                    <p className="text-sm text-neutral-500 max-w-[280px] mb-6">
                        Ocorreu um erro inesperado. Por favor, tente novamente.
                    </p>
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <pre className="text-xs text-left bg-neutral-100 p-3 rounded-lg max-w-full overflow-auto mb-4">
                            {this.state.error.message}
                        </pre>
                    )}
                    <Button onClick={this.handleReset} icon={<RefreshCw className="w-4 h-4" />}>
                        Tentar novamente
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}

// HOC for functional components
export function withErrorBoundary<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    fallback?: ReactNode
) {
    return function WithErrorBoundaryWrapper(props: P) {
        return (
            <ErrorBoundary fallback={fallback}>
                <WrappedComponent {...props} />
            </ErrorBoundary>
        );
    };
}
