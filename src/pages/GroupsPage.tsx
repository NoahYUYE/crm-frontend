import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Folder, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { getGroups, createGroup, updateGroup, deleteGroup } from '../api';
import type { CustomerGroup } from '../types';

const defaultColors = [
  '#7C3AED', '#EF4444', '#F59E0B', '#10B981', 
  '#3B82F6', '#EC4899', '#8B5CF6', '#06B6D4'
];

export default function GroupsPage() {
  const [groups, setGroups] = useState<CustomerGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<CustomerGroup | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    color: '#7C3AED',
    description: ''
  });

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    setIsLoading(true);
    try {
      const data = await getGroups();
      setGroups(data);
    } catch (error) {
      console.error('Failed to load groups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (group?: CustomerGroup) => {
    if (group) {
      setEditingGroup(group);
      setFormData({ 
        name: group.name, 
        color: group.color,
        description: group.description || ''
      });
    } else {
      setEditingGroup(null);
      setFormData({ name: '', color: '#7C3AED', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingGroup) {
        await updateGroup(editingGroup.id, formData);
      } else {
        await createGroup(formData);
      }
      setIsModalOpen(false);
      loadGroups();
    } catch (error) {
      console.error('Failed to save group:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除此分组吗？客户数据不会丢失。')) return;
    try {
      await deleteGroup(id);
      loadGroups();
    } catch (error) {
      console.error('Failed to delete group:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F0F6FC]">客户分组</h1>
          <p className="text-[#8B949E] mt-1">管理客户分组</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-2" />
          新增分组
        </Button>
      </div>

      {/* Groups grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      className="px-2 py-1 rounded" style={{ backgroundColor: `${group.color}20` }}
                    >
                      <Folder className="w-5 h-5" style={{ color: group.color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#F0F6FC]">{group.name}</h3>
                      {group.description && (
                        <p className="text-xs text-[#8B949E] mt-0.5">{group.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleOpenModal(group)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(group.id)}
                    >
                      <Trash2 className="w-3 h-3 text-red-400" />
                    </Button>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-[#30363D] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-[#8B949E]">
                    <Users className="w-4 h-4" />
                    <span>{group._count?.customers || 0} 位客户</span>
                  </div>
                  <Badge 
                    variant="default"
                    style={{ 
                      backgroundColor: `${group.color}20`,
                      color: group.color,
                      borderColor: group.color
                    }}
                  >
                    {group.color}
                  </Badge>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={editingGroup ? '编辑分组' : '新增分组'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="分组名称"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          
          <Input
            label="描述"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="分组描述（可选）"
          />
          
          <div>
            <label className="block text-sm font-medium text-[#8B949E] mb-2">选择颜色</label>
            <div className="flex flex-wrap gap-2">
              {defaultColors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-lg transition-transform ${
                    formData.color === color ? 'ring-2 ring-offset-2 ring-offset-[#161B22] scale-110' : ''
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="pt-4 border-t border-[#30363D]">
            <p className="text-xs text-[#8B949E] mb-2">预览</p>
            <div 
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg"
              className="px-2 py-1 rounded" style={{ backgroundColor: `${formData.color}15` }}
            >
              <Folder className="w-4 h-4" style={{ color: formData.color }} />
              <span style={{ color: formData.color }}>{formData.name || '分组名称'}</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              取消
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {editingGroup ? '保存' : '创建'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
