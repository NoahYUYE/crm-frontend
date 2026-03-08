export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'member';
  avatar?: string;
  createdAt?: string;
}

export interface Customer {
  id: number;
  companyName: string;
  contact: string;
  phone: string;
  email?: string;
  position?: string;
  source: string;
  industry?: string;
  companySize?: string;
  revenue?: string;
  address?: string;
  remark?: string;
  level: 'A' | 'B' | 'C' | 'D';
  ownerId: number;
  owner: {
    id: number;
    name: string;
    email: string;
  };
  group?: CustomerGroup;
  groupId?: number;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface CustomerGroup {
  id: number;
  name: string;
  color: string;
  description?: string;
  _count?: {
    customers: number;
  };
}

export interface Tag {
  id: number;
  name: string;
  color: string;
}

export interface FollowUp {
  id: number;
  customerId: number;
  customer?: {
    id: number;
    companyName: string;
    contact: string;
  };
  type: '电话' | '邮件' | '面谈' | '微信' | '会议' | '其他';
  content: string;
  nextFollowUp?: string;
  createdById: number;
  createdBy: {
    id: number;
    name: string;
  };
  createdAt: string;
}

export interface DashboardData {
  stats: {
    totalCustomers: number;
    newToday: number;
    newThisWeek: number;
    newThisMonth: number;
    recentlyActive: number;
  };
  customersByLevel: {
    level: string;
    count: number;
  }[];
  customersBySource: {
    source: string;
    count: number;
  }[];
  recentFollowUps: FollowUp[];
  upcomingFollowUps: (FollowUp & {
    customer: {
      id: number;
      companyName: string;
      contact: string;
    };
  })[];
  overdueFollowUps: (FollowUp & {
    customer: {
      id: number;
      companyName: string;
      contact: string;
    };
  })[];
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
