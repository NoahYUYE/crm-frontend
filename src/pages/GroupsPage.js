import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Folder, Users } from 'lucide-react';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { getGroups, createGroup, updateGroup, deleteGroup } from '../api';
const defaultColors = [
    '#7C3AED', '#EF4444', '#F59E0B', '#10B981',
    '#3B82F6', '#EC4899', '#8B5CF6', '#06B6D4'
];
export default function GroupsPage() {
    const [groups, setGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);
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
        }
        catch (error) {
            console.error('Failed to load groups:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleOpenModal = (group) => {
        if (group) {
            setEditingGroup(group);
            setFormData({
                name: group.name,
                color: group.color,
                description: group.description || ''
            });
        }
        else {
            setEditingGroup(null);
            setFormData({ name: '', color: '#7C3AED', description: '' });
        }
        setIsModalOpen(true);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingGroup) {
                await updateGroup(editingGroup.id, formData);
            }
            else {
                await createGroup(formData);
            }
            setIsModalOpen(false);
            loadGroups();
        }
        catch (error) {
            console.error('Failed to save group:', error);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleDelete = async (id) => {
        if (!confirm('确定要删除此分组吗？客户数据不会丢失。'))
            return;
        try {
            await deleteGroup(id);
            loadGroups();
        }
        catch (error) {
            console.error('Failed to delete group:', error);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-[#F0F6FC]", children: "\u5BA2\u6237\u5206\u7EC4" }), _jsx("p", { className: "text-[#8B949E] mt-1", children: "\u7BA1\u7406\u5BA2\u6237\u5206\u7EC4" })] }), _jsxs(Button, { onClick: () => handleOpenModal(), children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "\u65B0\u589E\u5206\u7EC4"] })] }), isLoading ? (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("div", { className: "w-8 h-8 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" }) })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: groups.map((group, index) => (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05 }, children: _jsxs(Card, { hover: true, className: "p-4", children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-lg flex items-center justify-center", className: "px-2 py-1 rounded", style: { backgroundColor: `${group.color}20` }, children: _jsx(Folder, { className: "w-5 h-5", style: { color: group.color } }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-[#F0F6FC]", children: group.name }), group.description && (_jsx("p", { className: "text-xs text-[#8B949E] mt-0.5", children: group.description }))] })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleOpenModal(group), children: _jsx(Edit, { className: "w-3 h-3" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDelete(group.id), children: _jsx(Trash2, { className: "w-3 h-3 text-red-400" }) })] })] }), _jsxs("div", { className: "pt-3 border-t border-[#30363D] flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm text-[#8B949E]", children: [_jsx(Users, { className: "w-4 h-4" }), _jsxs("span", { children: [group._count?.customers || 0, " \u4F4D\u5BA2\u6237"] })] }), _jsx(Badge, { variant: "default", style: {
                                            backgroundColor: `${group.color}20`,
                                            color: group.color,
                                            borderColor: group.color
                                        }, children: group.color })] })] }) }, group.id))) })), _jsx(Modal, { open: isModalOpen, onOpenChange: setIsModalOpen, title: editingGroup ? '编辑分组' : '新增分组', children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx(Input, { label: "\u5206\u7EC4\u540D\u79F0", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), required: true }), _jsx(Input, { label: "\u63CF\u8FF0", value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }), placeholder: "\u5206\u7EC4\u63CF\u8FF0\uFF08\u53EF\u9009\uFF09" }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-[#8B949E] mb-2", children: "\u9009\u62E9\u989C\u8272" }), _jsx("div", { className: "flex flex-wrap gap-2", children: defaultColors.map(color => (_jsx("button", { type: "button", onClick: () => setFormData({ ...formData, color }), className: `w-8 h-8 rounded-lg transition-transform ${formData.color === color ? 'ring-2 ring-offset-2 ring-offset-[#161B22] scale-110' : ''}` }, color))) })] }), _jsxs("div", { className: "pt-4 border-t border-[#30363D]", children: [_jsx("p", { className: "text-xs text-[#8B949E] mb-2", children: "\u9884\u89C8" }), _jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-2 rounded-lg", className: "px-2 py-1 rounded", style: { backgroundColor: `${formData.color}15` }, children: [_jsx(Folder, { className: "w-4 h-4", style: { color: formData.color } }), _jsx("span", { style: { color: formData.color }, children: formData.name || '分组名称' })] })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-4", children: [_jsx(Button, { type: "button", variant: "secondary", onClick: () => setIsModalOpen(false), children: "\u53D6\u6D88" }), _jsx(Button, { type: "submit", isLoading: isSubmitting, children: editingGroup ? '保存' : '创建' })] })] }) })] }));
}
