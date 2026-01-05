
import React, { useState, useEffect } from 'react';
import { Agreement, AgreementStatus, Milestone } from '../types';
import { Icons } from '../constants';
import { getAgreementAnalysis, suggestDisputeResolution } from '../geminiService';

interface AgreementDetailProps {
  agreement: Agreement;
  onUpdate: (id: string, updates: Partial<Agreement>) => void;
  onBack: () => void;
}

const AgreementDetail: React.FC<AgreementDetailProps> = ({ agreement, onUpdate, onBack }) => {
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'milestones' | 'history' | 'ai'>('milestones');

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoadingAi(true);
      const res = await getAgreementAnalysis(agreement);
      setAiAnalysis(res || '');
      setLoadingAi(false);
    };
    fetchAnalysis();
  }, [agreement.id]);

  const approveMilestone = (milestoneId: string) => {
    const updatedMilestones = agreement.milestones.map(m => 
      m.id === milestoneId ? { ...m, status: 'Approved' as const } : m
    );
    const allApproved = updatedMilestones.every(m => m.status === 'Approved');
    onUpdate(agreement.id, { 
      milestones: updatedMilestones,
      status: allApproved ? AgreementStatus.Completed : agreement.status
    });
  };

  const statuses = [
    AgreementStatus.Draft,
    AgreementStatus.Funded,
    AgreementStatus.InProgress,
    AgreementStatus.Completed
  ];

  const currentIdx = statuses.indexOf(agreement.status);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center space-x-2 text-slate-400 hover:text-slate-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          <span className="text-sm font-bold">Back to Dashboard</span>
        </button>
        <div className="flex space-x-3">
           {agreement.status === AgreementStatus.Draft && (
              <button 
                onClick={() => onUpdate(agreement.id, { status: AgreementStatus.Funded })}
                className="bg-sky-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-sky-700 transition-all shadow-lg shadow-sky-100"
              >
                Sign & Fund Contract
              </button>
           )}
           {agreement.status !== AgreementStatus.Completed && agreement.status !== AgreementStatus.Disputed && (
             <button 
               onClick={() => setShowDisputeModal(true)}
               className="bg-white border border-rose-200 text-rose-500 px-6 py-2.5 rounded-xl font-bold hover:bg-rose-50 transition-all"
             >
               Dispute Contract
             </button>
           )}
        </div>
      </div>

      {/* State Machine Stepper */}
      <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 -z-0"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-sky-500 -translate-y-1/2 -z-0 transition-all duration-700"
            style={{ width: `${(currentIdx / (statuses.length - 1)) * 100}%` }}
          ></div>
          
          {statuses.map((s, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                idx <= currentIdx ? 'bg-sky-500 text-white shadow-lg shadow-sky-200' : 'bg-white border-2 border-slate-100 text-slate-300'
              }`}>
                {idx < currentIdx ? <Icons.Check /> : <span>{idx + 1}</span>}
              </div>
              <span className={`mt-3 text-[10px] font-bold uppercase tracking-widest ${
                idx <= currentIdx ? 'text-sky-600' : 'text-slate-400'
              }`}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Info */}
          <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">{agreement.title}</h2>
                <p className="text-slate-400 text-sm mt-1">Deployed on Casper Testnet • {agreement.id}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-slate-400">Escrow Balance</p>
                <p className="text-2xl font-black text-slate-900">{agreement.totalAmount.toLocaleString()} CSPR</p>
              </div>
            </div>

            <div className="flex border-b border-slate-100">
               <button 
                onClick={() => setActiveTab('milestones')}
                className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'milestones' ? 'text-sky-600 border-b-2 border-sky-600' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 Milestones
               </button>
               <button 
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'history' ? 'text-sky-600 border-b-2 border-sky-600' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 On-Chain Events
               </button>
               <button 
                onClick={() => setActiveTab('ai')}
                className={`flex-1 py-4 text-sm font-bold transition-all ${activeTab === 'ai' ? 'text-sky-600 border-b-2 border-sky-600' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 AI Analysis
               </button>
            </div>

            <div className="p-0">
              {activeTab === 'milestones' && (
                <div className="divide-y divide-slate-50">
                   {agreement.milestones.map((m, idx) => (
                      <div key={m.id} className="p-8 flex items-center justify-between hover:bg-slate-50/50 transition-all">
                        <div className="flex items-center space-x-6">
                           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${
                             m.status === 'Approved' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                           }`}>
                             {m.status === 'Approved' ? <Icons.Check /> : idx + 1}
                           </div>
                           <div>
                             <h4 className="font-bold text-slate-800">{m.title}</h4>
                             <p className="text-xs text-slate-400">Due {new Date(m.deadline).toLocaleDateString()}</p>
                           </div>
                        </div>
                        <div className="flex items-center space-x-6">
                           <div className="text-right">
                              <p className="text-lg font-bold text-slate-900">{m.amount.toLocaleString()} CSPR</p>
                              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${m.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                {m.status}
                              </span>
                           </div>
                           {m.status === 'Pending' && agreement.status === AgreementStatus.Funded || agreement.status === AgreementStatus.InProgress ? (
                              <button 
                                onClick={() => approveMilestone(m.id)}
                                className="bg-slate-900 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-black transition-all shadow-lg shadow-slate-200"
                              >
                                Release
                              </button>
                           ) : null}
                        </div>
                      </div>
                   ))}
                </div>
              )}

              {activeTab === 'history' && (
                <div className="p-8 space-y-4">
                   <div className="flex items-start space-x-4 p-4 rounded-2xl border border-slate-100 bg-slate-50">
                      <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center text-sky-600 font-bold text-xs">TX</div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">Contract Deployed</p>
                        <p className="text-xs text-slate-400 font-mono">Hash: 0xf5...a12 | 2 days ago</p>
                      </div>
                   </div>
                   <div className="flex items-start space-x-4 p-4 rounded-2xl border border-slate-100">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 font-bold text-xs">EV</div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">Escrow Funded</p>
                        <p className="text-xs text-slate-400 font-mono">Block: 1,429,120 | 1 day ago</p>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'ai' && (
                <div className="p-8">
                  <div className="bg-sky-50 rounded-2xl p-6 border border-sky-100">
                     <h4 className="text-sky-800 font-bold mb-4 flex items-center space-x-2">
                        <Icons.Alert />
                        <span>AI Legal Risk Assessment</span>
                     </h4>
                     <p className="text-sm text-sky-800/80 leading-relaxed italic">{aiAnalysis || 'Loading analyzer...'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
             <h3 className="text-lg font-bold mb-8 flex items-center space-x-2 relative z-10">
                <Icons.Wallet />
                <span>Financial Summary</span>
             </h3>
             <div className="space-y-6 relative z-10">
                <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                  <span className="text-slate-400 text-sm font-medium">Agreement Value</span>
                  <span className="text-xl font-bold tracking-tight">{agreement.totalAmount.toLocaleString()} CSPR</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                  <span className="text-slate-400 text-sm font-medium">Liquid Staking</span>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full ${agreement.stakingEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                    {agreement.stakingEnabled ? 'STAKING ACTIVE' : 'NO STAKING'}
                  </span>
                </div>
                {agreement.stakingEnabled && (
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Yield Accrued (Real-time)</p>
                    <p className="text-2xl font-black text-emerald-400">+{agreement.yieldAccrued.toFixed(6)} <span className="text-xs">CSPR</span></p>
                  </div>
                )}
             </div>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-200 p-8">
             <h3 className="text-slate-900 font-bold mb-6">Parties</h3>
             <div className="space-y-6">
                <div className="flex items-center space-x-4">
                   <img className="w-10 h-10 rounded-xl bg-slate-100" src={`https://picsum.photos/seed/${agreement.initiator}/40/40`} />
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase">Initiator</p>
                      <p className="text-xs font-mono text-slate-800 truncate w-32">{agreement.initiator}</p>
                   </div>
                </div>
                <div className="flex items-center space-x-4">
                   <img className="w-10 h-10 rounded-xl bg-slate-100" src={`https://picsum.photos/seed/${agreement.counterparty}/40/40`} />
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase">Counterparty</p>
                      <p className="text-xs font-mono text-slate-800 truncate w-32">{agreement.counterparty}</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Dispute Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-lg p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-3xl font-bold text-slate-900 mb-2">Initialize Dispute</h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">This will freeze all escrowed funds. An AI resolution suggestion will be generated, and the specified arbitrator will be notified.</p>
            
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Dispute Rationale</label>
            <textarea 
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none h-40 mb-8"
              placeholder="Provide a detailed explanation for the dispute..."
            />
            
            <div className="flex space-x-4">
              <button 
                onClick={() => setShowDisputeModal(false)}
                className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all"
              >
                Back
              </button>
              <button 
                onClick={() => onUpdate(agreement.id, { status: AgreementStatus.Disputed })}
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white px-6 py-4 rounded-2xl font-bold shadow-xl shadow-rose-200 transition-all"
              >
                Confirm Dispute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgreementDetail;
