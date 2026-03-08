import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { login, register } from '../api';
export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        role: 'member'
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            if (isLogin) {
                const data = await login(formData.email, formData.password);
                localStorage.setItem('token', data.token);
                window.location.href = '/';
            }
            else {
                const data = await register(formData.email, formData.password, formData.name, formData.role);
                localStorage.setItem('token', data.token);
                window.location.href = '/';
            }
        }
        catch (err) {
            setError(err.response?.data?.error || '操作失败，请重试');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-[#0D1117] flex items-center justify-center p-4", children: [_jsx("div", { className: "fixed inset-0 bg-gradient-to-br from-[#0D1117] via-[#0D1117] to-[#1a1025] pointer-events-none" }), _jsx("div", { className: "fixed top-1/4 left-1/4 w-96 h-96 bg-[#7C3AED]/20 rounded-full blur-[100px] pointer-events-none" }), _jsx("div", { className: "fixed bottom-1/4 right-1/4 w-96 h-96 bg-[#A855F7]/10 rounded-full blur-[100px] pointer-events-none" }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "relative w-full max-w-md", children: _jsxs("div", { className: "glass rounded-2xl p-8", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#A855F7] mb-4", children: _jsx("span", { className: "text-white font-bold text-2xl", children: "C" }) }), _jsx("h1", { className: "text-2xl font-bold text-[#F0F6FC]", children: "\u6B22\u8FCE\u4F7F\u7528 CRM" }), _jsx("p", { className: "text-[#8B949E] mt-2", children: isLogin ? '登录您的账户' : '创建新账户' })] }), error && (_jsx("div", { className: "mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm", children: error })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [!isLogin && (_jsx(Input, { label: "\u59D3\u540D", placeholder: "\u8BF7\u8F93\u5165\u59D3\u540D", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), required: !isLogin })), _jsx(Input, { label: "\u90AE\u7BB1", type: "email", placeholder: "example@company.com", value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }), required: true }), _jsx(Input, { label: "\u5BC6\u7801", type: "password", placeholder: "\u8BF7\u8F93\u5165\u5BC6\u7801", value: formData.password, onChange: (e) => setFormData({ ...formData, password: e.target.value }), required: true }), _jsx(Button, { type: "submit", className: "w-full", size: "lg", isLoading: isLoading, children: isLogin ? '登录' : '注册' })] }), _jsx("div", { className: "mt-6 text-center", children: _jsx("button", { type: "button", onClick: () => setIsLogin(!isLogin), className: "text-sm text-[#8B949E] hover:text-[#A78BFA] transition-colors", children: isLogin ? '还没有账户？立即注册' : '已有账户？立即登录' }) }), _jsxs("div", { className: "mt-6 pt-6 border-t border-[#30363D]", children: [_jsx("p", { className: "text-xs text-[#6E7681] text-center mb-3", children: "\u6F14\u793A\u8D26\u6237" }), _jsxs("div", { className: "grid grid-cols-2 gap-2 text-xs", children: [_jsxs("div", { className: "p-2 bg-[#21262D] rounded-lg", children: [_jsx("p", { className: "text-[#8B949E]", children: "\u7BA1\u7406\u5458" }), _jsx("p", { className: "text-[#F0F6FC]", children: "admin@crm.com" }), _jsx("p", { className: "text-[#6E7681]", children: "admin123" })] }), _jsxs("div", { className: "p-2 bg-[#21262D] rounded-lg", children: [_jsx("p", { className: "text-[#8B949E]", children: "\u6210\u5458" }), _jsx("p", { className: "text-[#F0F6FC]", children: "member@crm.com" }), _jsx("p", { className: "text-[#6E7681]", children: "member123" })] })] })] })] }) })] }));
}
