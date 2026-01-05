
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import CreateAgreement from './views/CreateAgreement';
import AgreementDetail from './views/AgreementDetail';
import { Agreement, AgreementStatus, User } from './types';

const MOCK_USER: User = {
  address: '01bc6e32185c862419a799f2b963b1567d1d2830f30501a4f0876176378c858c3a',
  balance: 50000,
  role: 'initiator'
};

const INITIAL_AGREEMENTS: Agreement[] = [
  {
    id: 'ag-1',
    title: 'Mobile App Frontend Development',
    description: 'Build a React Native mobile app frontend based on provided Figma designs. Must include authentication, dashboard, and settings screens.',
    initiator: '01bc6e32...',
    counterparty: '0192a8b3...',
    status: AgreementStatus.InProgress,
    milestones: [
      { id: 'm1', title: 'Authentication Module', amount: 2000, deadline: '2024-05-15', status: 'Approved', description: 'Complete login and registration.' },
      { id: 'm2', title: 'Dashboard UI', amount: 3000, deadline: '2024-06-01', status: 'Pending', description: 'Main screen UI implementation.' }
    ],
    totalAmount: 5000,
    stakingEnabled: true,
    yieldAccrued: 4.285,
    createdAt: '2024-04-01'
  },
  {
    id: 'ag-2',
    title: 'Graphic Design Retainer - Q2',
    description: 'Professional graphic design services including 4 social media posts per week and 1 blog header.',
    initiator: '01bc6e32...',
    counterparty: '01777d8c...',
    status: AgreementStatus.Funded,
    milestones: [
      { id: 'm3', title: 'April Deliverables', amount: 1500, deadline: '2024-04-30', status: 'Pending', description: 'All social assets for April.' }
    ],
    totalAmount: 1500,
    stakingEnabled: false,
    yieldAccrued: 0,
    createdAt: '2024-04-10'
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [agreements, setAgreements] = useState<Agreement[]>(INITIAL_AGREEMENTS);
  const [selectedAgreementId, setSelectedAgreementId] = useState<string | null>(null);
  const [view, setView] = useState<'dashboard' | 'create' | 'detail'>('dashboard');

  // Simulate Staking Yield Accrual
  useEffect(() => {
    const timer = setInterval(() => {
      setAgreements(prev => prev.map(ag => {
        if (ag.stakingEnabled && ag.status !== AgreementStatus.Completed && ag.status !== AgreementStatus.Cancelled) {
          return { ...ag, yieldAccrued: ag.yieldAccrued + (ag.totalAmount * 0.0000001) };
        }
        return ag;
      }));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleCreateNew = () => setView('create');
  
  const handleViewDetail = (id: string) => {
    setSelectedAgreementId(id);
    setView('detail');
  };

  const handleAgreementSubmit = (data: any) => {
    const newAg: Agreement = {
      ...data,
      id: `ag-${Date.now()}`,
      initiator: MOCK_USER.address,
      yieldAccrued: 0,
      createdAt: new Date().toISOString()
    };
    setAgreements([newAg, ...agreements]);
    setView('dashboard');
  };

  const handleUpdateAgreement = (id: string, updates: Partial<Agreement>) => {
    setAgreements(prev => prev.map(ag => ag.id === id ? { ...ag, ...updates } : ag));
  };

  const selectedAgreement = agreements.find(ag => ag.id === selectedAgreementId);

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={(tab) => {
        setActiveTab(tab);
        setView('dashboard');
      }} 
      userAddress={MOCK_USER.address}
    >
      {view === 'dashboard' && (
        <Dashboard 
          agreements={agreements} 
          user={MOCK_USER} 
          onViewAgreement={handleViewDetail} 
          onCreateNew={handleCreateNew}
        />
      )}
      
      {view === 'create' && (
        <CreateAgreement 
          onCancel={() => setView('dashboard')} 
          onSubmit={handleAgreementSubmit}
        />
      )}

      {view === 'detail' && selectedAgreement && (
        <AgreementDetail 
          agreement={selectedAgreement} 
          onBack={() => setView('dashboard')}
          onUpdate={handleUpdateAgreement}
        />
      )}
    </Layout>
  );
};

export default App;
