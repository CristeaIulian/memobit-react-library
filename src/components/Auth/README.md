# Authentication Module

Reusable authentication components for all @memobit projects.

## Components

- **AuthLogin** - Login page component (with auto-redirect after successful login)
- **ChangePasswordModal** - Modal for changing user password
- **AuthProvider** - Context provider for authentication state
- **useAuth** - Hook to access authentication context

**Note:** ProtectedRoute is not provided by the library. Each project should create its own based on its react-router-dom version.

## Installation

This module is already included in `@memobit/libs`. Make sure you have the latest version installed:

```bash
npm install @memobit/libs@latest
```

## Usage

### 1. Wrap your app with AuthProvider

```tsx
import { AuthProvider } from '@memobit/libs';

function App() {
    return (
        <AuthProvider
            config={{
                apiBaseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
                appName: 'Books Manager',  // Optional - shown on login page
                storageKey: 'auth_token'    // Optional - defaults to 'auth_token'
            }}
        >
            {/* Your app content */}
        </AuthProvider>
    );
}
```

### 2. Add Login route

```tsx
import { AuthLogin } from '@memobit/libs';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<AuthLogin />} />
                {/* Other routes */}
            </Routes>
        </Router>
    );
}
```

### 3. Create ProtectedRoute component

Each project should create its own ProtectedRoute using the `useAuth` hook:

```tsx
// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@memobit/libs';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
```

### 4. Use ProtectedRoute

```tsx
import { ProtectedRoute } from '@components/ProtectedRoute';

<Route
    path="/"
    element={
        <ProtectedRoute>
            <HomePage />
        </ProtectedRoute>
    }
/>
```

### 5. Use authentication in components

```tsx
import { useAuth } from '@memobit/libs';

function Header() {
    const { user, logout } = useAuth();

    return (
        <div>
            <span>Welcome, {user?.username}</span>
            <button onClick={logout}>Logout</button>
        </div>
    );
}
```

### 6. Add Change Password feature

```tsx
import { ChangePasswordModal } from '@memobit/libs';

function UserMenu() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button onClick={() => setIsModalOpen(true)}>
                Change Password
            </button>
            <ChangePasswordModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
```

## Configuration Options

### AuthConfig

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `apiBaseUrl` | string | Yes | - | Base URL for authentication API |
| `appName` | string | No | 'Login' | Application name shown on login page |
| `storageKey` | string | No | 'auth_token' | Key used to store JWT token |

## Features

- ✅ JWT token-based authentication
- ✅ Remember me functionality (localStorage vs sessionStorage)
- ✅ Auto-restore session on page refresh
- ✅ Protected routes with loading state
- ✅ Change password with validation
- ✅ Fully typed with TypeScript
- ✅ Uses CSS tokens for theming
- ✅ Configurable per project

## Backend Requirements

Your API should implement these endpoints:

- `POST /auth/login` - Login with username/password, returns JWT token
- `GET /auth/verify` - Verify JWT token, returns user data
- `POST /auth/logout` - Logout (optional cleanup)
- `POST /auth/changePassword` - Change password with current password validation

See the backend implementation in `books/prod/api/apps/libs/controllers/AuthController.class.php` for reference.

## Environment Variables

Create a `.env` file in each project:

```env
REACT_APP_API_URL=http://localhost:3001/api
```

## Migration from Project-Specific Auth

To migrate from project-specific auth to this reusable module:

1. Install latest `@memobit/libs`
2. Replace local Login, AuthContext, useAuth with imports from `@memobit/libs`
3. Wrap app with `AuthProvider` and pass config
4. Update imports to use `AuthLogin` instead of `Login`
5. Remove local auth components and context files

## Example Complete Setup

```tsx
import {
    AuthProvider,
    AuthLogin,
    ProtectedRoute,
    ChangePasswordModal,
    useAuth
} from '@memobit/libs';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

export const App = () => {
    return (
        <AuthProvider
            config={{
                apiBaseUrl: process.env.REACT_APP_API_URL!,
                appName: 'Books Manager'
            }}
        >
            <Router>
                <Routes>
                    <Route path="/login" element={<AuthLogin />} />
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <HomePage />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
};
```
