import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, Mail, MapPin, User, Calendar, Plus, Clock, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { Badge, LevelBadge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { getCustomer, createFollowUp, deleteCustomer } from '../api';
import { formatDateTime, followUpTypeOptions } from '../lib/utils';
const followUpIcons = {
    '电话': Phone,
    '邮件': Mail,
    '面谈': User,
    '微信': Phone,
    '会议': Calendar,
    '其他': Clock
};
export default function CustomerDetailPage() {
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [followUps, setFollowUps] = useState([]);
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
    const loadCustomer = async (customerId) => {
        setIsLoading(true);
        try {
            const data = await getCustomer(customerId);
            setCustomer(data);
            setFollowUps(data.followUps || []);
        }
        catch (error) {
            console.error('Failed to load customer:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleAddFollowUp = async (e) => {
        e.preventDefault();
        if (!id)
            return;
        setIsSubmitting(true);
        try {
            const data = await createFollowUp(parseInt(id), {
                type: formData.type,
                content: formData.content,
                nextFollowUp: formData.nextFollowUp || undefined
            });
            setFollowUps([data, ...followUps]);
            setIsModalOpen(false);
            setFormData({ type: '电话', content: '', nextFollowUp: '' });
        }
        catch (error) {
            console.error('Failed to add follow-up:', error);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleDelete = async () => {
        if (!id || !confirm('确定要删除此客户吗？此操作不可恢复。'))
            return;
        try {
            await deleteCustomer(parseInt(id));
            window.location.href = '/customers';
        }
        catch (error) {
            console.error('Failed to delete customer:', error);
        }
    };
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("div", { className: "w-8 h-8 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" }) }));
    }
    if (!customer) {
        return (_jsxs("div", { className: "text-center py-12", children: [_jsx("p", { className: "text-[#8B949E]", children: "\u5BA2\u6237\u4E0D\u5B58\u5728" }), _jsx(Link, { to: "/customers", children: _jsx(Button, { variant: "secondary", className: "mt-4", children: "\u8FD4\u56DE\u5BA2\u6237\u5217\u8868" }) })] }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Link, { to: "/customers", children: _jsx(Button, { variant: "ghost", size: "sm", children: _jsx(ArrowLeft, { className: "w-4 h-4" }) }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-[#F0F6FC]", children: customer.companyName }), _jsx("p", { className: "text-[#8B949E]", children: "\u5BA2\u6237\u8BE6\u60C5" })] })] }), _jsx("div", { className: "flex items-center gap-2", children: _jsxs(Button, { variant: "danger", onClick: handleDelete, children: [_jsx(Trash2, { className: "w-4 h-4 mr-2" }), "\u5220\u9664\u5BA2\u6237"] }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "\u57FA\u672C\u4FE1\u606F" }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "grid grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-[#6E7681] mb-1", children: "\u8054\u7CFB\u4EBA" }), _jsx("p", { className: "text-[#F0F6FC]", children: customer.contact })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-[#6E7681] mb-1", children: "\u804C\u4F4D" }), _jsx("p", { className: "text-[#F0F6FC]", children: customer.position || '-' })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-[#6E7681] mb-1", children: "\u8054\u7CFB\u7535\u8BDD" }), _jsx("p", { className: "text-[#F0F6FC]", children: customer.phone })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-[#6E7681] mb-1", children: "\u7535\u5B50\u90AE\u7BB1" }), _jsx("p", { className: "text-[#F0F6FC]", children: customer.email || '-' })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-[#6E7681] mb-1", children: "\u5BA2\u6237\u6765\u6E90" }), _jsx("p", { className: "text-[#F0F6FC]", children: customer.source })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-[#6E7681] mb-1", children: "\u884C\u4E1A" }), _jsx("p", { className: "text-[#F0F6FC]", children: customer.industry || '-' })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-[#6E7681] mb-1", children: "\u516C\u53F8\u89C4\u6A21" }), _jsx("p", { className: "text-[#F0F6FC]", children: customer.companySize || '-' })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-[#6E7681] mb-1", children: "\u5E74\u8425\u4E1A\u989D" }), _jsx("p", { className: "text-[#F0F6FC]", children: customer.revenue || '-' })] })] })] }), customer.address && (_jsxs("div", { className: "mt-4 pt-4 border-t border-[#30363D]", children: [_jsx("p", { className: "text-xs text-[#6E7681] mb-1", children: "\u5730\u5740" }), _jsxs("p", { className: "text-[#F0F6FC] flex items-center gap-2", children: [_jsx(MapPin, { className: "w-4 h-4 text-[#8B949E]" }), customer.address] })] })), customer.remark && (_jsxs("div", { className: "mt-4 pt-4 border-t border-[#30363D]", children: [_jsx("p", { className: "text-xs text-[#6E7681] mb-1", children: "\u5907\u6CE8" }), _jsx("p", { className: "text-[#F0F6FC]", children: customer.remark })] }))] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [_jsx(CardTitle, { children: "\u8DDF\u8FDB\u8BB0\u5F55" }), _jsxs(Button, { size: "sm", onClick: () => setIsModalOpen(true), children: [_jsx(Plus, { className: "w-4 h-4 mr-1" }), "\u6DFB\u52A0\u8DDF\u8FDB"] })] }), _jsx(CardContent, { children: _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute left-4 top-0 bottom-0 w-px bg-[#30363D]" }), _jsx("div", { className: "space-y-6", children: followUps.length === 0 ? (_jsx("p", { className: "text-center text-[#8B949E] py-8", children: "\u6682\u65E0\u8DDF\u8FDB\u8BB0\u5F55" })) : (followUps.map((followUp, index) => {
                                                        const Icon = followUpIcons[followUp.type] || Clock;
                                                        return (_jsxs(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.1 }, className: "relative pl-10", children: [_jsx("div", { className: "absolute left-2.5 w-3 h-3 rounded-full bg-[#7C3AED] border-2 border-[#161B22]" }), _jsxs("div", { className: "p-4 rounded-lg bg-[#21262D]", children: [_jsxs("div", { className: "flex items-start justify-between mb-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Icon, { className: "w-4 h-4 text-[#A78BFA]" }), _jsx(Badge, { variant: "purple", children: followUp.type }), _jsx("span", { className: "text-xs text-[#6E7681]", children: followUp.createdBy.name })] }), _jsx("span", { className: "text-xs text-[#6E7681]", children: formatDateTime(followUp.createdAt) })] }), _jsx("p", { className: "text-[#F0F6FC] text-sm", children: followUp.content }), followUp.nextFollowUp && (_jsxs("div", { className: "mt-3 pt-3 border-t border-[#30363D] flex items-center gap-2 text-xs text-[#8B949E]", children: [_jsx(Calendar, { className: "w-3 h-3" }), "\u4E0B\u6B21\u8DDF\u8FDB: ", formatDateTime(followUp.nextFollowUp)] }))] })] }, followUp.id));
                                                    })) })] }) })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsx(Card, { children: _jsx(CardContent, { className: "pt-6", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-[#6E7681] mb-2", children: "\u5BA2\u6237\u5206\u7EA7" }), _jsx(LevelBadge, { level: customer.level })] }), customer.group && (_jsxs("div", { children: [_jsx("p", { className: "text-xs text-[#6E7681] mb-2", children: "\u5BA2\u6237\u5206\u7EC4" }), _jsx(Badge, { variant: "info", className: "text-sm px-3 py-1", style: {
                                                            backgroundColor: `${customer.group.color}20`,
                                                            borderColor: customer.group.color,
                                                            color: customer.group.color
                                                        }, children: customer.group.name })] }))] }) }) }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "\u6807\u7B7E" }) }), _jsx(CardContent, { children: _jsx("div", { className: "flex flex-wrap gap-2", children: customer.tags.length === 0 ? (_jsx("p", { className: "text-[#8B949E] text-sm", children: "\u6682\u65E0\u6807\u7B7E" })) : (customer.tags.map(tag => (_jsx("span", { className: "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium", style: {
                                                    backgroundColor: `${tag.color}20`,
                                                    color: tag.color,
                                                    border: `1px solid ${tag.color}40`
                                                }, children: tag.name }, tag.id)))) }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "\u8D1F\u8D23\u4EBA" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center text-white font-medium", children: customer.owner.name.charAt(0) }), _jsxs("div", { children: [_jsx("p", { className: "text-[#F0F6FC] font-medium", children: customer.owner.name }), _jsx("p", { className: "text-xs text-[#8B949E]", children: customer.owner.email })] })] }) })] }), _jsx(Card, { children: _jsx(CardContent, { className: "pt-6", children: _jsxs("div", { className: "space-y-3 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-[#8B949E]", children: "\u521B\u5EFA\u65F6\u95F4" }), _jsx("span", { className: "text-[#F0F6FC]", children: formatDateTime(customer.createdAt) })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-[#8B949E]", children: "\u66F4\u65B0\u65F6\u95F4" }), _jsx("span", { className: "text-[#F0F6FC]", children: formatDateTime(customer.updatedAt) })] })] }) }) })] })] }), _jsx(Modal, { open: isModalOpen, onOpenChange: setIsModalOpen, title: "\u6DFB\u52A0\u8DDF\u8FDB\u8BB0\u5F55", description: "\u8BB0\u5F55\u4E0E\u5BA2\u6237\u7684\u6C9F\u901A\u60C5\u51B5", children: _jsxs("form", { onSubmit: handleAddFollowUp, className: "space-y-4", children: [_jsx(Select, { label: "\u8DDF\u8FDB\u65B9\u5F0F", value: formData.type, onValueChange: (v) => setFormData({ ...formData, type: v }), options: followUpTypeOptions.map(t => ({ value: t, label: t })) }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-[#8B949E] mb-1.5", children: ["\u8DDF\u8FDB\u5185\u5BB9 ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("textarea", { value: formData.content, onChange: (e) => setFormData({ ...formData, content: e.target.value }), rows: 4, required: true, className: "w-full px-4 py-2.5 bg-[#0D1117] border border-[#30363D] rounded-lg text-[#F0F6FC] placeholder-[#6E7681] focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all resize-none", placeholder: "\u8BB0\u5F55\u672C\u6B21\u8DDF\u8FDB\u7684\u5185\u5BB9..." })] }), _jsx(Input, { label: "\u4E0B\u6B21\u8DDF\u8FDB\u65F6\u95F4", type: "datetime-local", value: formData.nextFollowUp, onChange: (e) => setFormData({ ...formData, nextFollowUp: e.target.value }) }), _jsxs("div", { className: "flex justify-end gap-3 pt-4", children: [_jsx(Button, { type: "button", variant: "secondary", onClick: () => setIsModalOpen(false), children: "\u53D6\u6D88" }), _jsx(Button, { type: "submit", isLoading: isSubmitting, children: "\u6DFB\u52A0\u8DDF\u8FDB" })] })] }) })] }));
}
