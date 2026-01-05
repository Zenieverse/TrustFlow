
import React, { useState } from 'react';
import { Icons } from '../constants';
import { AgreementStatus, Milestone } from '../types';
import { generateMilestones } from '../geminiService';

interface CreateAgreementProps {
  onCancel: () => void;
  onSubmit: (data: any) => void;
}

const CreateAgreement: React.FC<CreateAgreementProps> = ({ onCancel, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [counterparty, setCounterparty] = useState('');
  const [totalBudget, setTotalBudget] = useState(1000);
  const [stakingEnabled, setStakingEnabled] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [milestones, setMilestones] = useState<Partial<Milestone>[]>([
    { id: '1', title: '', amount: 0, deadline: '', status: 'Pending', description: '' }
  ]);

  const addMilestone = () => {
    setMilestones([...milestones, { id: Date.now().toString(), title: '', amount: 0, deadline: '', status: 'Pending', description: '' }]);
  };

  const handleAiDraft = async () => {
    if (!description || totalBudget <= 0) {
      alert("Please provide a description and total budget for AI analysis.");
      return;
    }
    setIsGenerating(true);
    const suggested = await generateMilestones(description, totalBudget);
    if (suggested.length > 0) {
      setMilestones(suggested);
    }
    setIsGenerating(false);
  };

  const updateMilestone = (idx: number, field: keyof Milestone, value: any) => {
    const updated = [...milestones];
    updated[idx] = { ...updated[idx], [field]: value };
    setMilestones(updated);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const calculatedTotal = milestones.reduce((sum, m) => sum + (Number(m.amount) || 0), 0);
    onSubmit({
      title,
      description,
      counterparty,
      stakingEnabled,
      milestones: milestones.map(m => ({ ...m, status: 'Pending' })),
      totalAmount: calculatedTotal,
      status: AgreementStatus.Draft
    });
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center space-x-2 text-slate-400 mb-6 cursor-pointer hover:text-slate-600 transition-colors" onClick={onCancel}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        <span className="text-sm font-semibold">Cancel and Return</span>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="p-10 border-b border-slate-100 bg-slate-50/50">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Draft Agreement</h2>
              <p className="text-slate-500 mt-2">Legal-grade on-chain escrow configuration for Casper Network.</p>
            </div>
            <div className="px-4 py-2 bg-white rounded-2xl border border-slate-200 flex items-center space-x-2 shadow-sm">
              <span className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-bold text-slate-600">Draft Mode</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="p-10 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Agreement Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all text-lg font-medium"
                  placeholder="e.g. Q3 Software Architecture Delivery"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Project Description</label>
                  <button 
                    type="button"
                    onClick={handleAiDraft}
                    disabled={isGenerating}
                    className="flex items-center space-x-2 text-sky-600 hover:text-sky-700 text-xs font-bold transition-all disabled:opacity-50"
                  >
                    {isGenerating ? (
                       <span className="animate-spin text-lg block">⌛</span>
                    ) : (
                      <div className="w-5 h-5 bg-sky-100 rounded flex items-center justify-center">AI</div>
                    )}
                    <span>{isGenerating ? 'Analyzing...' : 'Auto-Generate Milestones'}</span>
                  </button>
                </div>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all h-40 resize-none leading-relaxed"
                  placeholder="Describe the scope, deliverables, and expectations..."
                  required
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Counterparty Address</label>
                <input 
                  type="text" 
                  value={counterparty}
                  onChange={(e) => setCounterparty(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all font-mono text-sm"
                  placeholder="01abc2... (Public Key)"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-100">
                  <h4 className="font-bold text-slate-800 text-sm mb-1">Total Budget</h4>
                  <div className="flex items-center space-x-2 mt-2">
                    <input 
                      type="number"
                      value={totalBudget}
                      onChange={(e) => setTotalBudget(Number(e.target.value))}
                      className="bg-transparent text-2xl font-bold w-full outline-none"
                    />
                    <span className="text-xs font-bold text-slate-400">CSPR</span>
                  </div>
                </div>

                <div className="bg-slate-900 p-6 rounded-[24px] text-white">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm">Liquid Staking</h4>
                    <button 
                      type="button"
                      onClick={() => setStakingEnabled(!stakingEnabled)}
                      className={`w-10 h-5 rounded-full transition-colors relative ${stakingEnabled ? 'bg-sky-500' : 'bg-slate-700'}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${stakingEnabled ? 'left-5.5' : 'left-0.5'}`}></div>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">Earn native yield while funds are locked.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Payment Milestones</h3>
              <button 
                type="button" 
                onClick={addMilestone}
                className="bg-slate-100 hover:bg-slate-200 text-slate-900 px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-2 transition-all"
              >
                <Icons.Plus />
                <span>Add Custom</span>
              </button>
            </div>

            <div className="space-y-4">
              {milestones.map((milestone, idx) => (
                <div key={milestone.id} className="grid grid-cols-12 gap-4 items-start bg-slate-50/50 p-6 rounded-3xl border border-slate-100 hover:border-sky-200 transition-all group">
                  <div className="col-span-12 md:col-span-1 flex items-center justify-center pt-2">
                    <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-400 group-hover:bg-sky-500 group-hover:text-white group-hover:border-sky-500 transition-all">
                      {idx + 1}
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-5">
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Milestone Goal</label>
                    <input 
                      type="text"
                      value={milestone.title}
                      onChange={(e) => updateMilestone(idx, 'title', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500/20 outline-none"
                      placeholder="e.g. Initial Prototype Delivery"
                    />
                  </div>
                  <div className="col-span-6 md:col-span-2">
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Amount</label>
                    <div className="relative">
                      <input 
                        type="number"
                        value={milestone.amount}
                        onChange={(e) => updateMilestone(idx, 'amount', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500/20 outline-none pr-12"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">CSPR</span>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Est. Completion</label>
                    <input 
                      type="date"
                      value={milestone.deadline}
                      onChange={(e) => updateMilestone(idx, 'deadline', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-sky-500/20 outline-none"
                    />
                  </div>
                  <div className="col-span-12 md:col-span-1 flex justify-center pt-5">
                    {milestones.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => setMilestones(milestones.filter((_, i) => i !== idx))}
                        className="text-slate-300 hover:text-rose-500 transition-all p-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-8 border-t border-slate-100">
            <div className="text-slate-500 text-sm">
              <span className="font-bold text-slate-800">Total Contract Value: </span>
              {milestones.reduce((acc, m) => acc + (Number(m.amount) || 0), 0).toLocaleString()} CSPR
            </div>
            <div className="flex space-x-4">
              <button 
                type="button" 
                onClick={onCancel}
                className="px-8 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all"
              >
                Save for Later
              </button>
              <button 
                type="submit"
                className="bg-slate-900 hover:bg-black text-white px-10 py-3 rounded-2xl font-bold shadow-2xl shadow-slate-300 transition-all"
              >
                Deploy Smart Contract
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAgreement;
