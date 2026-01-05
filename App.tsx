
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import CreateAgreement from './views/CreateAgreement';
import AgreementDetail from './views/AgreementDetail';
import MyAgreements from './views/MyAgreements';
import StakingPool from './views/StakingPool';
import Settings from './views/Settings';
import WalletModal from './components/WalletModal';
import { Agreement, AgreementStatus, User } from './types';

const MOCK_USER: User = {
  address: '01bc6e32185c862419a799f2b963b1567d1d2830f30501a4f0876176378c858c3a',
  balance: 54200.50,
  role: 'initiator'
};

const INITIAL_AGREEMENTS: Agreement[] = [
  {
    id: 'ag-1',
    title: 'Mobile App Frontend Development',
    description: 'Build a React Native mobile app frontend based on provided Figma designs. Must include authentication, dashboard, and settings screens.',
    initiator: MOCK_USER.address,
    counterparty: '0192a8b38271...',
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
    initiator: MOCK_USER.address,
    counterparty: '01777d8c1122...',
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
  const [view, setView] = useState<'main' | 'create' | 'detail'>('main');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  // Yield simulator - Update real-time staking rewards
  useEffect(() => {
    const timer = setInterval(() => {
      setAgreements(prev => prev.map(ag => {
        if (ag.stakingEnabled && ag.status !== AgreementStatus.Completed && ag.status !== AgreementStatus.Cancelled) {
          // CSPR staking simulation: Total * 10% APY / 31.5M seconds in year
          return { ...ag, yieldAccrued: ag.yieldAccrued + (ag.totalAmount * 0.00000003) };
        }
        return ag;
      }));
    }, 1000);
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
    setView('main');
    setActiveTab('agreements');
  };

  const handleUpdateAgreement = (id: string, updates: Partial<Agreement>) => {
    setAgreements(prev => prev.map(ag => ag.id === id ? { ...ag, ...updates } : ag));
  };

  const connectWallet = () => setShowWalletModal(true);
  const finishConnection = () => {
    setIsWalletConnected(true);
    setShowWalletModal(false);
  };

  const selectedAgreement = agreements.find(ag => ag.id === selectedAgreementId);

  const renderActiveView = () => {
    if (view === 'create') return <CreateAgreement onCancel={() => setView('main')} onSubmit={handleAgreementSubmit} />;
    if (view === 'detail' && selectedAgreement) return <AgreementDetail agreement={selectedAgreement} onBack={() => setView('main')} onUpdate={handleUpdateAgreement} />;
    
    switch (activeTab) {
      case 'dashboard': return <Dashboard agreements={agreements} user={MOCK_USER} onViewAgreement={handleViewDetail} onCreateNew={handleCreateNew} />;
      case 'agreements': return <MyAgreements agreements={agreements} onViewAgreement={handleViewDetail} onCreateNew={handleCreateNew} userAddress={MOCK_USER.address} />;
      case 'staking': return <StakingPool agreements={agreements} />;
      case 'settings': return <Settings user={MOCK_USER} />;
      default: return <Dashboard agreements={agreements} user={MOCK_USER} onViewAgreement={handleViewDetail} onCreateNew={handleCreateNew} />;
    }
  };

  return (
    <div className="relative font-sans antialiased text-slate-900 bg-slate-50">
      <Layout 
        activeTab={activeTab} 
        setActiveTab={(tab) => { setActiveTab(tab); setView('main'); }} 
        userAddress={isWalletConnected ? MOCK_USER.address : 'Not Connected'}
        isConnected={isWalletConnected}
        onConnect={connectWallet}
      >
        {!isWalletConnected && activeTab === 'dashboard' ? (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-10 animate-in fade-in zoom-in-95 duration-700">
            <div className="relative">
               <div className="absolute inset-0 bg-sky-500 blur-3xl opacity-20 animate-pulse"></div>
               <div className="relative w-24 h-24 bg-white rounded-[32px] shadow-2xl flex items-center justify-center text-sky-600 border border-sky-100">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
               </div>
            </div>
            <div className="max-w-xl space-y-4">
               <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">Secure On-Chain <br/><span className="text-sky-600">Trust Agreements</span></h2>
               <p className="text-lg text-slate-500 font-medium">Deploy enterprise-grade escrow contracts with milestone-based releases and integrated liquid staking yield.</p>
            </div>
            <button 
              onClick={connectWallet}
              className="bg-slate-900 hover:bg-black text-white px-10 py-5 rounded-[24px] font-bold shadow-2xl shadow-slate-300 transition-all transform hover:-translate-y-1 active:scale-95 text-lg"
            >
              Connect Casper Account
            </button>
          </div>
        ) : renderActiveView()}
      </Layout>

      {showWalletModal && (
        <WalletModal onClose={() => setShowWalletModal(false)} onConnect={finishConnection} />
      )}
    </div>
  );
};

export default App;
