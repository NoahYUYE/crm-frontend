import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const data = await login(formData.email, formData.password);
        localStorage.setItem('token', data.token);
        window.location.href = '/';
      } else {
        const data = await register(formData.email, formData.password, formData.name, formData.role);
        localStorage.setItem('token', data.token);
        window.location.href = '/';
      }
    } catch (err: any) {
      setError(err.response?.data?.error || '操作失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0D1117] via-[#0D1117] to-[#1a1025] pointer-events-none" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-[#7C3AED]/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-[#A855F7]/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="glass rounded-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#A855F7] mb-4">
              <span className="text-white font-bold text-2xl">C</span>
            </div>
            <h1 className="text-2xl font-bold text-[#F0F6FC]">欢迎使用 CRM</h1>
            <p className="text-[#8B949E] mt-2">{isLogin ? '登录您的账户' : '创建新账户'}</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <Input
                label="姓名"
                placeholder="请输入姓名"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required={!isLogin}
              />
            )}
            <Input
              label="邮箱"
              type="email"
              placeholder="example@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="密码"
              type="password"
              placeholder="请输入密码"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              {isLogin ? '登录' : '注册'}
            </Button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-[#8B949E] hover:text-[#A78BFA] transition-colors"
            >
              {isLogin ? '还没有账户？立即注册' : '已有账户？立即登录'}
            </button>
          </div>

          {/* Demo accounts */}
          <div className="mt-6 pt-6 border-t border-[#30363D]">
            <p className="text-xs text-[#6E7681] text-center mb-3">演示账户</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-[#21262D] rounded-lg">
                <p className="text-[#8B949E]">管理员</p>
                <p className="text-[#F0F6FC]">admin@crm.com</p>
                <p className="text-[#6E7681]">admin123</p>
              </div>
              <div className="p-2 bg-[#21262D] rounded-lg">
                <p className="text-[#8B949E]">成员</p>
                <p className="text-[#F0F6FC]">member@crm.com</p>
                <p className="text-[#6E7681]">member123</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
