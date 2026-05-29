import { Component, ErrorInfo, ReactNode } from 'react';

import { EmptyState } from '../EmptyState';

import './ErrorBoundary.scss';

export interface ErrorBoundaryProps {
    /** Content to render while no error has been thrown. */
    children: ReactNode;
    /** Title shown above the error message. Defaults to "Something went wrong". */
    title?: string;
    /** Label for the reset button. Defaults to "Try again". */
    resetLabel?: string;
    /**
     * Optional callback invoked when an error is caught. Use this to forward to
     * a logging service. Console logging is always done as a fallback.
     */
    onError?: (error: Error, info: ErrorInfo) => void;
    /**
     * Optional render override for the fallback UI. When provided, the default
     * EmptyState fallback is bypassed and the caller is fully in control.
     */
    fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
    error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { error: null };

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { error };
    }

    componentDidCatch(error: Error, info: ErrorInfo): void {
        // Console fallback is always emitted so issues are noticed during dev.
        console.error('ErrorBoundary caught:', error, info.componentStack);
        this.props.onError?.(error, info);
    }

    private reset = (): void => {
        this.setState({ error: null });
    };

    render(): ReactNode {
        const { error } = this.state;
        const { children, title, resetLabel, fallback } = this.props;

        if (!error) {
            return children;
        }

        if (fallback) {
            return fallback(error, this.reset);
        }

        return (
            <div className="error-boundary">
                <EmptyState
                    icon="warning"
                    title={title ?? 'Something went wrong'}
                    description={error.message || 'An unexpected error occurred.'}
                    primary={{
                        text: resetLabel ?? 'Try again',
                        variant: 'info',
                        onClick: this.reset,
                    }}
                />
            </div>
        );
    }
}
