import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Phone, Mail, Building, User, Edit, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { Badge, LevelBadge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer, getTags, getGroups } from '../api';
import { sourceOptions, industryOptions, companySizeOptions } from '../lib/utils';
export default function CustomersPage() {
    const [customers, setCustomers] = useState([]);
    const [tags, setTags] = useState([]);
    const [groups, setGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [search, setSearch] = useState('');
    const [levelFilter, setLevelFilter] = useState('');
    const [sourceFilter, setSourceFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
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
        }
        catch (error) {
            console.error('Failed to load customers:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleOpenModal = (customer) => {
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
        }
        else {
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const data = {
                ...formData,
                groupId: formData.groupId ? parseInt(formData.groupId) : undefined
            };
            if (editingCustomer) {
                await updateCustomer(editingCustomer.id, data);
            }
            else {
                await createCustomer(data);
            }
            setIsModalOpen(false);
            loadData();
        }
        catch (error) {
            console.error('Failed to save customer:', error);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleDelete = async (id) => {
        if (!confirm('确定要删除此客户吗？此操作不可恢复。'))
            return;
        try {
            await deleteCustomer(id);
            loadData();
        }
        catch (error) {
            console.error('Failed to delete customer:', error);
        }
    };
    const totalPages = Math.ceil(total / limit);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-[#F0F6FC]", children: "\u5BA2\u6237\u7BA1\u7406" }), _jsxs("p", { className: "text-[#8B949E] mt-1", children: ["\u5171 ", total, " \u4F4D\u5BA2\u6237"] })] }), _jsxs(Button, { onClick: () => handleOpenModal(), children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "\u65B0\u589E\u5BA2\u6237"] })] }), _jsx(Card, { className: "p-4", children: _jsxs("div", { className: "flex flex-wrap gap-4", children: [_jsx("div", { className: "flex-1 min-w-[200px]", children: _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E7681]" }), _jsx("input", { type: "text", placeholder: "\u641C\u7D22\u516C\u53F8\u540D\u3001\u8054\u7CFB\u4EBA\u3001\u7535\u8BDD...", value: search, onChange: (e) => setSearch(e.target.value), className: "w-full pl-10 pr-4 py-2 bg-[#0D1117] border border-[#30363D] rounded-lg text-sm text-[#F0F6FC] placeholder-[#6E7681] focus:outline-none focus:border-[#7C3AED]" })] }) }), _jsx(Select, { value: levelFilter, onValueChange: setLevelFilter, placeholder: "\u5BA2\u6237\u5206\u7EA7", options: [
                                { value: '', label: '全部等级' },
                                { value: 'A', label: 'A级 - 高价值' },
                                { value: 'B', label: 'B级 - 潜力' },
                                { value: 'C', label: 'C级 - 一般' },
                                { value: 'D', label: 'D级 - 低价值' }
                            ] }), _jsx(Select, { value: sourceFilter, onValueChange: setSourceFilter, placeholder: "\u5BA2\u6237\u6765\u6E90", options: [
                                { value: '', label: '全部来源' },
                                ...sourceOptions.map(s => ({ value: s, label: s }))
                            ] })] }) }), _jsx("div", { className: "space-y-4", children: isLoading ? (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("div", { className: "w-8 h-8 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" }) })) : customers.length === 0 ? (_jsx(Card, { className: "p-12 text-center", children: _jsx("p", { className: "text-[#8B949E]", children: "\u6682\u65E0\u5BA2\u6237\u6570\u636E" }) })) : (customers.map((customer, index) => (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05 }, children: _jsx(Card, { hover: true, className: "p-4", children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "w-12 h-12 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center text-white font-medium shrink-0", children: customer.companyName.charAt(0) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx(Link, { to: `/customers/${customer.id}`, className: "text-lg font-semibold text-[#F0F6FC] hover:text-[#A78BFA] transition-colors", children: customer.companyName }), _jsx(LevelBadge, { level: customer.level }), customer.group && (_jsx(Badge, { variant: "purple", children: customer.group.name }))] }), _jsxs("div", { className: "flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#8B949E]", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(User, { className: "w-4 h-4" }), customer.contact, customer.position && _jsxs("span", { className: "text-[#6E7681]", children: ["(", customer.position, ")"] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Phone, { className: "w-4 h-4" }), customer.phone] }), customer.email && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Mail, { className: "w-4 h-4" }), customer.email] })), customer.industry && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Building, { className: "w-4 h-4" }), customer.industry] }))] }), customer.tags.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-2 mt-3", children: customer.tags.map(tag => (_jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium", style: {
                                                    backgroundColor: `${tag.color}20`,
                                                    color: tag.color,
                                                    border: `1px solid ${tag.color}40`
                                                }, children: tag.name }, tag.id))) }))] }), _jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [_jsx(Link, { to: `/customers/${customer.id}`, children: _jsx(Button, { variant: "ghost", size: "sm", children: _jsx(Eye, { className: "w-4 h-4" }) }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleOpenModal(customer), children: _jsx(Edit, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDelete(customer.id), children: _jsx(Trash2, { className: "w-4 h-4 text-red-400" }) })] })] }) }) }, customer.id)))) }), totalPages > 1 && (_jsxs("div", { className: "flex items-center justify-center gap-2", children: [_jsx(Button, { variant: "ghost", size: "sm", disabled: page === 1, onClick: () => setPage(p => p - 1), children: _jsx(ChevronLeft, { className: "w-4 h-4" }) }), _jsxs("span", { className: "text-sm text-[#8B949E]", children: ["\u7B2C ", page, " / ", totalPages, " \u9875"] }), _jsx(Button, { variant: "ghost", size: "sm", disabled: page === totalPages, onClick: () => setPage(p => p + 1), children: _jsx(ChevronRight, { className: "w-4 h-4" }) })] })), _jsx(Modal, { open: isModalOpen, onOpenChange: setIsModalOpen, title: editingCustomer ? '编辑客户' : '新增客户', description: editingCustomer ? '修改客户信息' : '填写客户基本信息', className: "max-w-2xl", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(Input, { label: "\u516C\u53F8\u540D\u79F0", value: formData.companyName, onChange: (e) => setFormData({ ...formData, companyName: e.target.value }), required: true }), _jsx(Input, { label: "\u8054\u7CFB\u4EBA", value: formData.contact, onChange: (e) => setFormData({ ...formData, contact: e.target.value }), required: true }), _jsx(Input, { label: "\u8054\u7CFB\u7535\u8BDD", value: formData.phone, onChange: (e) => setFormData({ ...formData, phone: e.target.value }), required: true }), _jsx(Input, { label: "\u7535\u5B50\u90AE\u7BB1", type: "email", value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }) }), _jsx(Input, { label: "\u804C\u4F4D", value: formData.position, onChange: (e) => setFormData({ ...formData, position: e.target.value }) }), _jsx(Select, { label: "\u5BA2\u6237\u6765\u6E90", value: formData.source, onValueChange: (v) => setFormData({ ...formData, source: v }), placeholder: "\u9009\u62E9\u6765\u6E90", options: sourceOptions.map(s => ({ value: s, label: s })), required: true }), _jsx(Select, { label: "\u884C\u4E1A", value: formData.industry, onValueChange: (v) => setFormData({ ...formData, industry: v }), placeholder: "\u9009\u62E9\u884C\u4E1A", options: industryOptions.map(i => ({ value: i, label: i })) }), _jsx(Select, { label: "\u516C\u53F8\u89C4\u6A21", value: formData.companySize, onValueChange: (v) => setFormData({ ...formData, companySize: v }), placeholder: "\u9009\u62E9\u89C4\u6A21", options: companySizeOptions.map(s => ({ value: s, label: s })) }), _jsx(Select, { label: "\u5BA2\u6237\u5206\u7EA7", value: formData.level, onValueChange: (v) => setFormData({ ...formData, level: v }), options: [
                                        { value: 'A', label: 'A级 - 高价值' },
                                        { value: 'B', label: 'B级 - 潜力' },
                                        { value: 'C', label: 'C级 - 一般' },
                                        { value: 'D', label: 'D级 - 低价值' }
                                    ] }), _jsx(Select, { label: "\u5BA2\u6237\u5206\u7EC4", value: formData.groupId, onValueChange: (v) => setFormData({ ...formData, groupId: v }), placeholder: "\u9009\u62E9\u5206\u7EC4", options: groups.map(g => ({ value: g.id.toString(), label: g.name })) })] }), _jsx(Input, { label: "\u5730\u5740", value: formData.address, onChange: (e) => setFormData({ ...formData, address: e.target.value }) }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-[#8B949E] mb-1.5", children: "\u5907\u6CE8" }), _jsx("textarea", { value: formData.remark, onChange: (e) => setFormData({ ...formData, remark: e.target.value }), rows: 3, className: "w-full px-4 py-2.5 bg-[#0D1117] border border-[#30363D] rounded-lg text-[#F0F6FC] placeholder-[#6E7681] focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all resize-none", placeholder: "\u5176\u4ED6\u5907\u6CE8\u4FE1\u606F..." })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-4", children: [_jsx(Button, { type: "button", variant: "secondary", onClick: () => setIsModalOpen(false), children: "\u53D6\u6D88" }), _jsx(Button, { type: "submit", isLoading: isSubmitting, children: editingCustomer ? '保存修改' : '创建客户' })] })] }) })] }));
}
