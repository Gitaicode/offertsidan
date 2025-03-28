export interface User {
  id: string;
  email: string;
  alias: string;
  role: 'admin' | 'ue';
}

export interface Bid {
  id: string;
  userId: string;
  alias: string;
  projectId: string;
  price: number;
  coverage: number;
  submissionDate: string;
  isJoker?: boolean;
  ranking?: number;
  comment?: string;
}

export interface Project {
  id: string;
  name: string;
  category: string;
  deadline: string;
  status: 'active' | 'evaluating' | 'completed';
} 