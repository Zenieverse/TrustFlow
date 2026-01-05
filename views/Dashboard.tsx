
import React from 'react';
import { Agreement, User, AgreementStatus } from '../types';
import AgreementCard from '../components/AgreementCard';
import { Icons } from '../constants';

interface DashboardProps {
  agreements: Agreement[];
  user: User;
  onViewAgreement: (id: string) => void;
  onCreateNew: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ agreements, user, onViewAgreement, onCreateNew }) => {
  const activeAgreements = agreements.filter(a => a.status !== AgreementStatus.Completed && a.status !== AgreementStatus.Cancelled);
  
  const stats = [
    { label: 'Live Escrows', value: activeAgreements.length, icon: <Icons.Agreement />, color: 'bg-sky-500' },
    { label: 'Secured Assets', value: `${agreements.reduce((acc, curr) => acc + curr.totalAmount, 0).toLocaleString()} CSPR`, icon: <Icons.Wallet />, color: 'bg-indigo-600' },
    { label: 'Yield Gained', value: `${agreements.reduce((acc, curr) => acc + curr.yieldAccrued, 0).toFixed(4)} CSPR`, icon: <Icons.Plus />, color: 'bg-emerald-500' },
    { label: 'Wallet', value: `${user.balance.toLocaleString()} CSPR`, icon: <Icons.Wallet />, color: 'bg-slate-700' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">System Pulse</h2>
          <p className="text-slate-500 mt-2 font-medium">Real-time status of your Casper decentralized agreements.</p>
        </div>
        <button 
          onClick={onCreateNew}
          className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-4 rounded-[20px] font-bold shadow-2xl shadow-sky-200 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center space-x-3"
        >
          <Icons.Plus />
          <span>New Agreement</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col space-y-4">
              <div className={`${stat.color} w-12 h-12 rounded-2xl text-white flex items-center justify-center shadow-lg shadow-current/10`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">High Priority Agreements</h3>
            <button className="text-sky-600 font-bold text-sm hover:underline tracking-tight">Manage All Portfolio</button>
          </div>
          
          {agreements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {agreements.slice(0, 4).map(agreement => (
                <AgreementCard 
                  key={agreement.id} 
                  agreement={agreement} 
                  onClick={onViewAgreement} 
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[40px] py-24 flex flex-col items-center justify-center text-slate-400">
              <div className="mb-6 w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center opacity-40"><Icons.Agreement /></div>
              <p className="font-bold text-lg">No active agreements found.</p>
              <p className="text-sm">Initiate a contract to secure your first milestone payment.</p>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>
             <h3 className="text-lg font-bold mb-6 flex items-center space-x-2">
                <Icons.Wallet />
                <span>Yield Forecast</span>
             </h3>
             <div className="space-y-6">
                <div>
                   <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Expected APY</p>
                   <p className="text-3xl font-black text-emerald-400 tracking-tighter">10.42%</p>
                </div>
                <div className="pt-6 border-t border-slate-800">
                   <p className="text-slate-500 text-xs leading-relaxed">
                     By enabling liquid staking on your escrows, you are earning native Casper rewards while maintaining payment security.
                   </p>
                </div>
                <button className="w-full bg-white/10 hover:bg-white/20 text-white py-4 rounded-2xl font-bold text-sm transition-all">
                  Analyze Staking Strategy
                </button>
             </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[40px] p-8">
             <h3 className="font-bold text-slate-900 mb-6 flex items-center space-x-2">
                <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                <span>Network Events</span>
             </h3>
             <div className="space-y-6">
                <div className="flex items-start space-x-4">
                   <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 font-bold text-[10px]">TX</div>
                   <div>
                      <p className="text-xs font-bold text-slate-800">Block #1,249,021 Finalized</p>
                      <p className="text-[10px] text-slate-400">32 seconds ago</p>
                   </div>
                </div>
                <div className="flex items-start space-x-4">
                   <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-[10px]">EV</div>
                   <div>
                      <p className="text-xs font-bold text-slate-800">New Escrow Funded: ag-2</p>
                      <p className="text-[10px] text-slate-400">5 minutes ago</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
