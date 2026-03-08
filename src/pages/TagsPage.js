import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { getTags, createTag, updateTag, deleteTag } from '../api';
const defaultColors = [
    '#7C3AED', '#EF4444', '#F59E0B', '#10B981',
    '#3B82F6', '#EC4899', '#8B5CF6', '#06B6D4'
];
export default function TagsPage() {
    const [tags, setTags] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTag, setEditingTag] = useState(null);
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
        }
        catch (error) {
            console.error('Failed to load tags:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleOpenModal = (tag) => {
        if (tag) {
            setEditingTag(tag);
            setFormData({ name: tag.name, color: tag.color });
        }
        else {
            setEditingTag(null);
            setFormData({ name: '', color: '#7C3AED' });
        }
        setIsModalOpen(true);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingTag) {
                await updateTag(editingTag.id, formData);
            }
            else {
                await createTag(formData);
            }
            setIsModalOpen(false);
            loadTags();
        }
        catch (error) {
            console.error('Failed to save tag:', error);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleDelete = async (id) => {
        if (!confirm('确定要删除此标签吗？'))
            return;
        try {
            await deleteTag(id);
            loadTags();
        }
        catch (error) {
            console.error('Failed to delete tag:', error);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-[#F0F6FC]", children: "\u6807\u7B7E\u7BA1\u7406" }), _jsx("p", { className: "text-[#8B949E] mt-1", children: "\u7BA1\u7406\u5BA2\u6237\u6807\u7B7E" })] }), _jsxs(Button, { onClick: () => handleOpenModal(), children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "\u65B0\u589E\u6807\u7B7E"] })] }), isLoading ? (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("div", { className: "w-8 h-8 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" }) })) : (_jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: tags.map((tag, index) => (_jsx(motion.div, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, transition: { delay: index * 0.05 }, children: _jsx(Card, { hover: true, className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-4 h-4 rounded-full", className: "px-2 py-1 rounded", style: { backgroundColor: tag.color } }), _jsx("span", { className: "font-medium text-[#F0F6FC]", children: tag.name })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleOpenModal(tag), children: _jsx(Edit, { className: "w-3 h-3" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDelete(tag.id), children: _jsx(Trash2, { className: "w-3 h-3 text-red-400" }) })] })] }) }) }, tag.id))) })), _jsx(Modal, { open: isModalOpen, onOpenChange: setIsModalOpen, title: editingTag ? '编辑标签' : '新增标签', children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx(Input, { label: "\u6807\u7B7E\u540D\u79F0", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), required: true }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-[#8B949E] mb-2", children: "\u9009\u62E9\u989C\u8272" }), _jsx("div", { className: "flex flex-wrap gap-2", children: defaultColors.map(color => (_jsx("button", { type: "button", onClick: () => setFormData({ ...formData, color }), className: `w-8 h-8 rounded-full transition-transform ${formData.color === color ? 'ring-2 ring-offset-2 ring-offset-[#161B22] scale-110' : ''}` }, color))) })] }), _jsxs("div", { className: "pt-4 border-t border-[#30363D]", children: [_jsx("p", { className: "text-xs text-[#8B949E] mb-2", children: "\u9884\u89C8" }), _jsx("span", { className: "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium", style: {
                                        backgroundColor: `${formData.color}20`,
                                        color: formData.color,
                                        border: `1px solid ${formData.color}40`
                                    }, children: formData.name || '标签名称' })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-4", children: [_jsx(Button, { type: "button", variant: "secondary", onClick: () => setIsModalOpen(false), children: "\u53D6\u6D88" }), _jsx(Button, { type: "submit", isLoading: isSubmitting, children: editingTag ? '保存' : '创建' })] })] }) })] }));
}
