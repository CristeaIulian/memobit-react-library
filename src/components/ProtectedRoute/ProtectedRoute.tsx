import type { ReactElement, ReactNode } from 'react';
import { Navigate } from 'react-router';

import { useAuth } from '../../hooks/useAuth';
import { Loading } from '../Loading';

import './ProtectedRoute.scss';

export interface ProtectedRouteProps {
    children: ReactNode;
    loginPath?: string;
}

// Holds rendering until AuthProvider has verified the session, then either shows the
// protected tree or redirects to the login page.
export function ProtectedRoute({ children, loginPath = '/login' }: ProtectedRouteProps): ReactElement {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="ProtectedRoute__loading">
                <Loading />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to={loginPath} replace />;
    }

    return <>{children}</>;
}
