import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Phone,
  Mail,
  MapPin,
  Building,
  User,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { Badge, LevelBadge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer, getTags, getGroups } from '../api';
import type { Customer, Tag, CustomerGroup } from '../types';
import { cn, sourceOptions, industryOptions, companySizeOptions } from '../lib/utils';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [groups, setGroups] = useState<CustomerGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    companyName: '',
    contact: '',
    phone: '',
    email: '',
    position: '',
    source: '',
    industry: '',
    companySize: '',
    revenue: '',
    address: '',
    remark: '',
    level: 'C',
    groupId: ''
  });

  useEffect(() => {
    loadData();
  }, [page, search, levelFilter, sourceFilter]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [customersData, tagsData, groupsData] = await Promise.all([
        getCustomers({ 
          page, 
          limit, 
          search: search || undefined,
          level: levelFilter || undefined,
          source: sourceFilter || undefined
        }),
        getTags(),
        getGroups()
      ]);
      setCustomers(customersData.data);
      setTotal(customersData.total);
      setTags(tagsData);
      setGroups(groupsData);
    } catch (error) {
      console.error('Failed to load customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        companyName: customer.companyName,
        contact: customer.contact,
        phone: customer.phone,
        email: customer.email || '',
        position: customer.position || '',
        source: customer.source,
        industry: customer.industry || '',
        companySize: customer.companySize || '',
        revenue: customer.revenue || '',
        address: customer.address || '',
        remark: customer.remark || '',
        level: customer.level,
        groupId: customer.groupId?.toString() || ''
      });
    } else {
      setEditingCustomer(null);
      setFormData({
        companyName: '',
        contact: '',
        phone: '',
        email: '',
        position: '',
        source: '',
        industry: '',
        companySize: '',
        revenue: '',
        address: '',
        remark: '',
        level: 'C',
        groupId: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = {
        ...formData,
        groupId: formData.groupId ? parseInt(formData.groupId) : undefined
      };
      
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, data);
      } else {
        await createCustomer(data);
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error('Failed to save customer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除此客户吗？此操作不可恢复。')) return;
    try {
      await deleteCustomer(id);
      loadData();
    } catch (error) {
      console.error('Failed to delete customer:', error);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F0F6FC]">客户管理</h1>
          <p className="text-[#8B949E] mt-1">共 {total} 位客户</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-2" />
          新增客户
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E7681]" />
              <input
                type="text"
                placeholder="搜索公司名、联系人、电话..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-sm text-[#F0F6FC] placeholder-[#6E7681] focus:outline-none focus:border-[#7C3AED]"
              />
            </div>
          </div>
          <Select
            value={levelFilter}
            onValueChange={setLevelFilter}
            placeholder="客户分级"
            options={[
              { value: '', label: '全部等级' },
              { value: 'A', label: 'A级 - 高价值' },
              { value: 'B', label: 'B级 - 潜力' },
              { value: 'C', label: 'C级 - 一般' },
              { value: 'D', label: 'D级 - 低价值' }
            ]}
          />
          <Select
            value={sourceFilter}
            onValueChange={setSourceFilter}
            placeholder="客户来源"
            options={[
              { value: '', label: '全部来源' },
              ...sourceOptions.map(s => ({ value: s, label: s }))
            ]}
          />
        </div>
      </Card>

      {/* Customer list */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : customers.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-[#8B949E]">暂无客户数据</p>
          </Card>
        ) : (
          customers.map((customer, index) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover className="p-4">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center text-white font-medium shrink-0">
                    {customer.companyName.charAt(0)}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Link 
                        to={`/customers/${customer.id}`}
                        className="text-lg font-semibold text-[#F0F6FC] hover:text-[#A78BFA] transition-colors"
                      >
                        {customer.companyName}
                      </Link>
                      <LevelBadge level={customer.level} />
                      {customer.group && (
                        <Badge variant="purple">{customer.group.name}</Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#8B949E]">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {customer.contact}
                        {customer.position && <span className="text-[#6E7681]">({customer.position})</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {customer.phone}
                      </div>
                      {customer.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {customer.email}
                        </div>
                      )}
                      {customer.industry && (
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          {customer.industry}
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {customer.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {customer.tags.map(tag => (
                          <span
                            key={tag.id}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                            style={{ 
                              backgroundColor: `${tag.color}20`,
                              color: tag.color,
                              border: `1px solid ${tag.color}40`
                            }}
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Link to={`/customers/${customer.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleOpenModal(customer)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(customer.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-[#8B949E]">
            第 {page} / {totalPages} 页
          </span>
          <Button
            variant="ghost"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Modal */}
      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={editingCustomer ? '编辑客户' : '新增客户'}
        description={editingCustomer ? '修改客户信息' : '填写客户基本信息'}
        className="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="公司名称"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              required
            />
            <Input
              label="联系人"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              required
            />
            <Input
              label="联系电话"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <Input
              label="电子邮箱"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="职位"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            />
            <Select
              label="客户来源"
              value={formData.source}
              onValueChange={(v) => setFormData({ ...formData, source: v })}
              placeholder="选择来源"
              options={sourceOptions.map(s => ({ value: s, label: s }))}
              required
            />
            <Select
              label="行业"
              value={formData.industry}
              onValueChange={(v) => setFormData({ ...formData, industry: v })}
              placeholder="选择行业"
              options={industryOptions.map(i => ({ value: i, label: i }))}
            />
            <Select
              label="公司规模"
              value={formData.companySize}
              onValueChange={(v) => setFormData({ ...formData, companySize: v })}
              placeholder="选择规模"
              options={companySizeOptions.map(s => ({ value: s, label: s }))}
            />
            <Select
              label="客户分级"
              value={formData.level}
              onValueChange={(v) => setFormData({ ...formData, level: v })}
              options={[
                { value: 'A', label: 'A级 - 高价值' },
                { value: 'B', label: 'B级 - 潜力' },
                { value: 'C', label: 'C级 - 一般' },
                { value: 'D', label: 'D级 - 低价值' }
              ]}
            />
            <Select
              label="客户分组"
              value={formData.groupId}
              onValueChange={(v) => setFormData({ ...formData, groupId: v })}
              placeholder="选择分组"
              options={groups.map(g => ({ value: g.id.toString(), label: g.name }))}
            />
          </div>
          
          <Input
            label="地址"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
          
          <div>
            <label className="block text-sm font-medium text-[#8B949E] mb-1.5">备注</label>
            <textarea
              value={formData.remark}
              onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 bg-[#0D1117] border border-[#30363D] rounded-lg text-[#F0F6FC] placeholder-[#6E7681] focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all resize-none"
              placeholder="其他备注信息..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              取消
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {editingCustomer ? '保存修改' : '创建客户'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
