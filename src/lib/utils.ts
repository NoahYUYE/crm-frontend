import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateTime(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('zh-CN');
}
export function formatDate(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('zh-CN');
}
export const sourceOptions = [
  { value: 'online', label: '线上推广' },
  { value: 'exhibition', label: '展会' },
  { value: 'referral', label: '朋友推荐' },
  { value: 'outbound', label: '主动获客' },
  { value: 'other', label: '其他' },
]
export const industryOptions = [
  { value: 'tech', label: '科技' },
  { value: 'finance', label: '金融' },
  { value: 'retail', label: '零售' },
  { value: 'manufacturing', label: '制造业' },
  { value: 'service', label: '服务业' },
  { value: 'other', label: '其他' },
]
export const companySizeOptions = [
  { value: 'small', label: '50人以下' },
  { value: 'medium', label: '50-200人' },
  { value: 'large', label: '200-500人' },
  { value: 'enterprise', label: '500人以上' },
]

export const followUpTypeOptions = [
  { value: 'phone', label: '电话' },
  { value: 'email', label: '邮件' },
  { value: 'meeting', label: '面谈' },
  { value: 'wechat', label: '微信' },
  { value: 'other', label: '其他' },
]

