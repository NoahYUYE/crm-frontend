import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Building,
  User,
  Calendar,
  Edit,
  Plus,
  Clock,
  Trash2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { Badge, LevelBadge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { getCustomer, createFollowUp, deleteCustomer } from '../api';
import type { Customer, FollowUp } from '../types';
import { formatDateTime, followUpTypeOptions } from '../lib/utils';

const followUpIcons: Record<string, any> = {
  '电话': Phone,
  '邮件': Mail,
  '面谈': User,
  '微信': Phone,
  '会议': Calendar,
  '其他': Clock
};

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);

  const [formData, setFormData] = useState({
    type: '电话',
    content: '',
    nextFollowUp: ''
  });

  useEffect(() => {
    if (id) {
      loadCustomer(parseInt(id));
    }
  }, [id]);

  const loadCustomer = async (customerId: number) => {
    setIsLoading(true);
    try {
      const data = await getCustomer(customerId);
      setCustomer(data);
      setFollowUps(data.followUps || []);
    } catch (error) {
      console.error('Failed to load customer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setIsSubmitting(true);
    try {
      const data = await createFollowUp(parseInt(id), {
        type: formData.type as any,
        content: formData.content,
        nextFollowUp: formData.nextFollowUp || undefined
      });
      setFollowUps([data, ...followUps]);
      setIsModalOpen(false);
      setFormData({ type: '电话', content: '', nextFollowUp: '' });
    } catch (error) {
      console.error('Failed to add follow-up:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm('确定要删除此客户吗？此操作不可恢复。')) return;
    try {
      await deleteCustomer(parseInt(id));
      window.location.href = '/customers';
    } catch (error) {
      console.error('Failed to delete customer:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-[#8B949E]">客户不存在</p>
        <Link to="/customers">
          <Button variant="secondary" className="mt-4">返回客户列表</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/customers">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#F0F6FC]">{customer.companyName}</h1>
            <p className="text-[#8B949E]">客户详情</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="danger" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            删除客户
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic info */}
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-[#6E7681] mb-1">联系人</p>
                    <p className="text-[#F0F6FC]">{customer.contact}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6E7681] mb-1">职位</p>
                    <p className="text-[#F0F6FC]">{customer.position || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6E7681] mb-1">联系电话</p>
                    <p className="text-[#F0F6FC]">{customer.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6E7681] mb-1">电子邮箱</p>
                    <p className="text-[#F0F6FC]">{customer.email || '-'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-[#6E7681] mb-1">客户来源</p>
                    <p className="text-[#F0F6FC]">{customer.source}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6E7681] mb-1">行业</p>
                    <p className="text-[#F0F6FC]">{customer.industry || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6E7681] mb-1">公司规模</p>
                    <p className="text-[#F0F6FC]">{customer.companySize || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6E7681] mb-1">年营业额</p>
                    <p className="text-[#F0F6FC]">{customer.revenue || '-'}</p>
                  </div>
                </div>
              </div>

              {customer.address && (
                <div className="mt-4 pt-4 border-t border-[#30363D]">
                  <p className="text-xs text-[#6E7681] mb-1">地址</p>
                  <p className="text-[#F0F6FC] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#8B949E]" />
                    {customer.address}
                  </p>
                </div>
              )}

              {customer.remark && (
                <div className="mt-4 pt-4 border-t border-[#30363D]">
                  <p className="text-xs text-[#6E7681] mb-1">备注</p>
                  <p className="text-[#F0F6FC]">{customer.remark}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Follow-up timeline */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>跟进记录</CardTitle>
              <Button size="sm" onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4 mr-1" />
                添加跟进
              </Button>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-px bg-[#30363D]" />

                {/* Timeline items */}
                <div className="space-y-6">
                  {followUps.length === 0 ? (
                    <p className="text-center text-[#8B949E] py-8">暂无跟进记录</p>
                  ) : (
                    followUps.map((followUp, index) => {
                      const Icon = followUpIcons[followUp.type] || Clock;
                      return (
                        <motion.div
                          key={followUp.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative pl-10"
                        >
                          {/* Timeline dot */}
                          <div className="absolute left-2.5 w-3 h-3 rounded-full bg-[#7C3AED] border-2 border-[#161B22]" />
                          
                          <div className="p-4 rounded-lg bg-[#21262D]">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4 text-[#A78BFA]" />
                                <Badge variant="purple">{followUp.type}</Badge>
                                <span className="text-xs text-[#6E7681]">
                                  {followUp.createdBy.name}
                                </span>
                              </div>
                              <span className="text-xs text-[#6E7681]">
                                {formatDateTime(followUp.createdAt)}
                              </span>
                            </div>
                            <p className="text-[#F0F6FC] text-sm">{followUp.content}</p>
                            {followUp.nextFollowUp && (
                              <div className="mt-3 pt-3 border-t border-[#30363D] flex items-center gap-2 text-xs text-[#8B949E]">
                                <Calendar className="w-3 h-3" />
                                下次跟进: {formatDateTime(followUp.nextFollowUp)}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer level & group */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-[#6E7681] mb-2">客户分级</p>
                  <LevelBadge level={customer.level} />
                </div>
                {customer.group && (
                  <div>
                    <p className="text-xs text-[#6E7681] mb-2">客户分组</p>
                    <Badge 
                      variant="info"
                      className="text-sm px-3 py-1"
                      style={{ 
                        backgroundColor: `${customer.group.color}20`,
                        borderColor: customer.group.color,
                        color: customer.group.color
                      }}
                    >
                      {customer.group.name}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>标签</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {customer.tags.length === 0 ? (
                  <p className="text-[#8B949E] text-sm">暂无标签</p>
                ) : (
                  customer.tags.map(tag => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: `${tag.color}20`,
                        color: tag.color,
                        border: `1px solid ${tag.color}40`
                      }}
                    >
                      {tag.name}
                    </span>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Owner */}
          <Card>
            <CardHeader>
              <CardTitle>负责人</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center text-white font-medium">
                  {customer.owner.name.charAt(0)}
                </div>
                <div>
                  <p className="text-[#F0F6FC] font-medium">{customer.owner.name}</p>
                  <p className="text-xs text-[#8B949E]">{customer.owner.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Meta info */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#8B949E]">创建时间</span>
                  <span className="text-[#F0F6FC]">{formatDateTime(customer.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8B949E]">更新时间</span>
                  <span className="text-[#F0F6FC]">{formatDateTime(customer.updatedAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add follow-up modal */}
      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="添加跟进记录"
        description="记录与客户的沟通情况"
      >
        <form onSubmit={handleAddFollowUp} className="space-y-4">
          <Select
            label="跟进方式"
            value={formData.type}
            onValueChange={(v) => setFormData({ ...formData, type: v })}
            options={followUpTypeOptions.map(t => ({ value: t, label: t }))}
          />
          
          <div>
            <label className="block text-sm font-medium text-[#8B949E] mb-1.5">
              跟进内容 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={4}
              required
              className="w-full px-4 py-2.5 bg-[#0D1117] border border-[#30363D] rounded-lg text-[#F0F6FC] placeholder-[#6E7681] focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all resize-none"
              placeholder="记录本次跟进的内容..."
            />
          </div>

          <Input
            label="下次跟进时间"
            type="datetime-local"
            value={formData.nextFollowUp}
            onChange={(e) => setFormData({ ...formData, nextFollowUp: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              取消
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              添加跟进
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
