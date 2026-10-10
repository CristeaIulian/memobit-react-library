// Separate entry point: these components depend on react-router, which not every app
// uses. Keeping them out of the main bundle means those apps never have to resolve it.
export { ProtectedRoute, type ProtectedRouteProps } from './components/ProtectedRoute';
