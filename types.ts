
export enum AgreementStatus {
  Draft = 'Draft',
  Funded = 'Funded',
  InProgress = 'InProgress',
  Review = 'Review',
  Disputed = 'Disputed',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export interface Milestone {
  id: string;
  title: string;
  amount: number; // In CSPR
  deadline: string;
  status: 'Pending' | 'Completed' | 'Approved' | 'Disputed';
  description: string;
}

export interface Agreement {
  id: string;
  title: string;
  description: string;
  initiator: string;
  counterparty: string;
  arbitrator?: string;
  status: AgreementStatus;
  milestones: Milestone[];
  totalAmount: number;
  stakingEnabled: boolean;
  yieldAccrued: number;
  createdAt: string;
  crossChainSettlement?: string;
}

export interface User {
  address: string;
  balance: number;
  role: 'initiator' | 'counterparty' | 'arbitrator';
}
