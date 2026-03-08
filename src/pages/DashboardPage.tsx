import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  ArrowRight,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Video,
  
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { getDashboard } from '../api';
import type { DashboardData } from '../types';
import { formatDateTime } from '../lib/utils';

const followUpIcons: Record<string, any> = {
  '电话': Phone,
  '邮件': Mail,
  '面谈': MessageSquare,
  '微信': MessageSquare,
  '会议': Video,
  '其他': Calendar
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = data?.stats || {
    totalCustomers: 0,
    newToday: 0,
    newThisWeek: 0,
    newThisMonth: 0,
    recentlyActive: 0
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[#F0F6FC]">仪表盘</h1>
        <p className="text-[#8B949E] mt-1">欢迎回来，这里是您的业务概览</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#7C3AED]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-[#A78BFA]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#F0F6FC]">{stats.totalCustomers}</p>
                <p className="text-sm text-[#8B949E]">客户总数</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#F0F6FC]">{stats.newThisWeek}</p>
                <p className="text-sm text-[#8B949E]">本周新增</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#F0F6FC]">{stats.newThisMonth}</p>
                <p className="text-sm text-[#8B949E]">本月新增</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#F0F6FC]">{stats.recentlyActive}</p>
                <p className="text-sm text-[#8B949E]">7天内活跃</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer levels */}
        <Card>
          <CardHeader>
            <CardTitle>客户分级分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data?.customersByLevel.map((item) => (
                <div key={item.level} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                    item.level === 'A' ? 'level-a' :
                    item.level === 'B' ? 'level-b' :
                    item.level === 'C' ? 'level-c' : 'level-d'
                  }`}>
                    {item.level}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-[#F0F6FC]">
                        {item.level === 'A' ? 'A级客户' : 
                         item.level === 'B' ? 'B级客户' : 
                         item.level === 'C' ? 'C级客户' : 'D级客户'}
                      </span>
                      <span className="text-sm text-[#8B949E]">{item.count} 家</span>
                    </div>
                    <div className="h-2 bg-[#21262D] rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          item.level === 'A' ? 'bg-red-500' :
                          item.level === 'B' ? 'bg-yellow-500' :
                          item.level === 'C' ? 'bg-blue-500' : 'bg-gray-500'
                        }`}
                        style={{ width: `${(item.count / (stats.totalCustomers || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent follow-ups */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>最近跟进</CardTitle>
            <Link to="/customers" className="text-sm text-[#A78BFA] hover:text-[#7C3AED] flex items-center gap-1">
              查看全部 <ArrowRight className="w-4 h-4" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.recentFollowUps.slice(0, 5).map((followUp) => {
                const Icon = followUpIcons[followUp.type] || Calendar;
                return (
                  <div key={followUp.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#21262D] transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-[#21262D] flex items-center justify-center">
                      <Icon className="w-4 h-4 text-[#A78BFA]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#F0F6FC] truncate">
                          {followUp.customer?.companyName}
                        </span>
                        <Badge variant="purple">{followUp.type}</Badge>
                      </div>
                      <p className="text-xs text-[#8B949E] mt-1 line-clamp-2">{followUp.content}</p>
                      <p className="text-xs text-[#6E7681] mt-1">
                        {followUp.createdBy.name} · {formatDateTime(followUp.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
              {(!data?.recentFollowUps || data.recentFollowUps.length === 0) && (
                <p className="text-center text-[#8B949E] py-8">暂无跟进记录</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming follow-ups */}
        <Card>
          <CardHeader>
            <CardTitle>即将跟进</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data?.upcomingFollowUps.map((followUp) => (
                <div key={followUp.id} className="flex items-center gap-3 p-3 rounded-lg border border-[#30363D]">
                  <div className="w-10 h-10 rounded-lg bg-[#7C3AED]/20 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[#A78BFA]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#F0F6FC] truncate">
                      {followUp.customer?.companyName}
                    </p>
                    <p className="text-xs text-[#8B949E]">
                      {formatDateTime(followUp.nextFollowUp!)}
                    </p>
                  </div>
                </div>
              ))}
              {(!data?.upcomingFollowUps || data.upcomingFollowUps.length === 0) && (
                <p className="text-center text-[#8B949E] py-8">暂无即将跟进的客户</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Overdue follow-ups */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-red-400">逾期跟进</span>
              {data?.overdueFollowUps && data.overdueFollowUps.length > 0 && (
                <Badge variant="error">{data.overdueFollowUps.length}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data?.overdueFollowUps.map((followUp) => (
                <div key={followUp.id} className="flex items-center gap-3 p-3 rounded-lg border border-red-500/30 bg-red-500/5">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#F0F6FC] truncate">
                      {followUp.customer?.companyName}
                    </p>
                    <p className="text-xs text-red-400">
                      应跟进时间: {formatDateTime(followUp.nextFollowUp!)}
                    </p>
                  </div>
                </div>
              ))}
              {(!data?.overdueFollowUps || data.overdueFollowUps.length === 0) && (
                <p className="text-center text-[#8B949E] py-8">暂无逾期跟进</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
