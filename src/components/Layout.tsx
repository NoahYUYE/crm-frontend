import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Tags,
  Folder,
  Settings,
  LogOut,
  Bell,
  Search
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';

const navigation = [
  { name: '仪表盘', href: '/', icon: LayoutDashboard },
  { name: '客户管理', href: '/customers', icon: Users },
  { name: '标签管理', href: '/tags', icon: Tags },
  { name: '客户分组', href: '/groups', icon: Folder },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0D1117]">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0D1117] via-[#0D1117] to-[#1a1025] pointer-events-none" />
      
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 glass border-r border-[#30363D] z-30">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-[#30363D]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div>
                <h1 className="text-[#F0F6FC] font-semibold">CRM</h1>
                <p className="text-xs text-[#8B949E]">客户管理系统</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-[#7C3AED]/15 text-[#A78BFA] border border-[#7C3AED]/30'
                      : 'text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D]'
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-[#30363D]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center text-white text-sm font-medium">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#F0F6FC] truncate">{user?.name}</p>
                <p className="text-xs text-[#8B949E] truncate">{user?.role === 'admin' ? '管理员' : '成员'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D] rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              退出登录
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-20 glass border-b border-[#30363D]">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E7681]" />
                <input
                  type="text"
                  placeholder="搜索客户..."
                  className="w-full pl-10 pr-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-sm text-[#F0F6FC] placeholder-[#6E7681] focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D] transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#7C3AED] rounded-full" />
              </button>
              <button className="p-2 rounded-lg text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D] transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
