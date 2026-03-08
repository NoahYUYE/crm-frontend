import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Tag as TagIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { getTags, createTag, updateTag, deleteTag } from '../api';
import type { Tag } from '../types';

const defaultColors = [
  '#7C3AED', '#EF4444', '#F59E0B', '#10B981', 
  '#3B82F6', '#EC4899', '#8B5CF6', '#06B6D4'
];

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    color: '#7C3AED'
  });

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    setIsLoading(true);
    try {
      const data = await getTags();
      setTags(data);
    } catch (error) {
      console.error('Failed to load tags:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (tag?: Tag) => {
    if (tag) {
      setEditingTag(tag);
      setFormData({ name: tag.name, color: tag.color });
    } else {
      setEditingTag(null);
      setFormData({ name: '', color: '#7C3AED' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingTag) {
        await updateTag(editingTag.id, formData);
      } else {
        await createTag(formData);
      }
      setIsModalOpen(false);
      loadTags();
    } catch (error) {
      console.error('Failed to save tag:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除此标签吗？')) return;
    try {
      await deleteTag(id);
      loadTags();
    } catch (error) {
      console.error('Failed to delete tag:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F0F6FC]">标签管理</h1>
          <p className="text-[#8B949E] mt-1">管理客户标签</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-2" />
          新增标签
        </Button>
      </div>

      {/* Tags grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tags.map((tag, index) => (
            <motion.div
              key={tag.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      className="px-2 py-1 rounded" style={{ backgroundColor: tag.color }}
                    />
                    <span className="font-medium text-[#F0F6FC]">{tag.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleOpenModal(tag)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(tag.id)}
                    >
                      <Trash2 className="w-3 h-3 text-red-400" />
                    </Button>
                  </div>
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
        title={editingTag ? '编辑标签' : '新增标签'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="标签名称"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-[#8B949E] mb-2">选择颜色</label>
            <div className="flex flex-wrap gap-2">
              {defaultColors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-full transition-transform ${
                    formData.color === color ? 'ring-2 ring-offset-2 ring-offset-[#161B22] scale-110' : ''
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="pt-4 border-t border-[#30363D]">
            <p className="text-xs text-[#8B949E] mb-2">预览</p>
            <span
              className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium"
              style={{ 
                backgroundColor: `${formData.color}20`,
                color: formData.color,
                border: `1px solid ${formData.color}40`
              }}
            >
              {formData.name || '标签名称'}
            </span>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              取消
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {editingTag ? '保存' : '创建'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
