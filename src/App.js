import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CustomersPage from './pages/CustomersPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import TagsPage from './pages/TagsPage';
import GroupsPage from './pages/GroupsPage';
function ProtectedRoute({ children }) {
    const { user, isLoading } = useAuth();
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen bg-[#0D1117] flex items-center justify-center", children: _jsx("div", { className: "w-8 h-8 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" }) }));
    }
    if (!user) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return _jsx(_Fragment, { children: children });
}
function AppRoutes() {
    const { user, isLoading } = useAuth();
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen bg-[#0D1117] flex items-center justify-center", children: _jsx("div", { className: "w-8 h-8 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" }) }));
    }
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: user ? _jsx(Navigate, { to: "/", replace: true }) : _jsx(LoginPage, {}) }), _jsx(Route, { path: "/*", element: _jsx(ProtectedRoute, { children: _jsx(Layout, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "/customers", element: _jsx(CustomersPage, {}) }), _jsx(Route, { path: "/customers/:id", element: _jsx(CustomerDetailPage, {}) }), _jsx(Route, { path: "/tags", element: _jsx(TagsPage, {}) }), _jsx(Route, { path: "/groups", element: _jsx(GroupsPage, {}) })] }) }) }) })] }));
}
export default function App() {
    return (_jsx(BrowserRouter, { children: _jsx(AuthProvider, { children: _jsx(AppRoutes, {}) }) }));
}
