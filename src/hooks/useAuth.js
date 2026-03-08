import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../api';
const AuthContext = createContext(undefined);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            getMe()
                .then(setUser)
                .catch(() => {
                localStorage.removeItem('token');
            })
                .finally(() => setIsLoading(false));
        }
        else {
            setIsLoading(false);
        }
    }, []);
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        window.location.href = '/login';
    };
    return (_jsx(AuthContext.Provider, { value: { user, setUser, isLoading, logout }, children: children }));
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
