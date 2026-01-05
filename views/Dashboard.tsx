
import React from 'react';
import { Agreement, User } from '../types';
import AgreementCard from '../components/AgreementCard';
import { Icons } from '../constants';

interface DashboardProps {
  agreements: Agreement[];
  user: User;
  onViewAgreement: (id: string) => void;
  onCreateNew: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ agreements, user, onViewAgreement, onCreateNew }) => {
  const stats = [
    { label: 'Active Agreements', value: agreements.length, icon: <Icons.Agreement />, color: 'bg-blue-500' },
    { label: 'Total Escrow Locked', value: `${agreements.reduce((acc, curr) => acc + curr.totalAmount, 0).toLocaleString()} CSPR`, icon: <Icons.Wallet />, color: 'bg-indigo-500' },
    { label: 'Yield Accrued', value: `${agreements.reduce((acc, curr) => acc + curr.yieldAccrued, 0).toFixed(2)} CSPR`, icon: <Icons.Plus />, color: 'bg-emerald-500' },
    { label: 'Wallet Balance', value: `${user.balance.toLocaleString()} CSPR`, icon: <Icons.Wallet />, color: 'bg-slate-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Overview</h2>
          <p className="text-slate-500 mt-1">Manage your on-chain agreements and track escrowed funds.</p>
        </div>
        <button 
          onClick={onCreateNew}
          className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-sky-200 transition-all flex items-center space-x-2"
        >
          <Icons.Plus />
          <span>New Agreement</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className={`${stat.color} p-3 rounded-xl text-white`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="text-xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-800">Recent Agreements</h3>
          <button className="text-sky-600 font-semibold text-sm hover:underline">View All</button>
        </div>
        
        {agreements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agreements.map(agreement => (
              <AgreementCard 
                key={agreement.id} 
                agreement={agreement} 
                onClick={onViewAgreement} 
              />
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl py-12 flex flex-col items-center justify-center text-slate-400">
            <div className="mb-4 opacity-20"><Icons.Agreement /></div>
            <p className="font-medium">No agreements found. Create your first one to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
