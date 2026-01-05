
import React, { useState } from 'react';
import { Agreement, AgreementStatus } from '../types';
import AgreementCard from '../components/AgreementCard';
import { Icons } from '../constants';

interface MyAgreementsProps {
  agreements: Agreement[];
  onViewAgreement: (id: string) => void;
  onCreateNew: () => void;
  userAddress: string;
}

const MyAgreements: React.FC<MyAgreementsProps> = ({ agreements, onViewAgreement, onCreateNew, userAddress }) => {
  const [filter, setFilter] = useState<AgreementStatus | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = agreements.filter(ag => {
    const matchesFilter = filter === 'All' || ag.status === filter;
    const matchesSearch = ag.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Portfolio</h2>
          <p className="text-slate-500 mt-2">Manage all your active and historical smart agreements.</p>
        </div>
        <button 
          onClick={onCreateNew}
          className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 shadow-xl shadow-slate-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Icons.Plus />
          <span>Launch Contract</span>
        </button>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 p-6 flex flex-wrap items-center gap-4 shadow-sm">
        <div className="flex-1 min-w-[300px] relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input 
            type="text"
            placeholder="Search agreements by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium"
          />
        </div>
        
        <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-2xl">
          {['All', AgreementStatus.Funded, AgreementStatus.InProgress, AgreementStatus.Completed].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === f ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.length > 0 ? (
          filtered.map(ag => (
            <AgreementCard key={ag.id} agreement={ag} onClick={onViewAgreement} />
          ))
        ) : (
          <div className="col-span-full py-20 bg-white border-2 border-dashed border-slate-100 rounded-[40px] flex flex-col items-center justify-center text-slate-400">
            <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-4">
              <Icons.Agreement />
            </div>
            <p className="font-bold">No results found matching your criteria.</p>
            <button onClick={() => {setFilter('All'); setSearchTerm('');}} className="mt-4 text-sky-600 font-bold hover:underline">Clear all filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAgreements;
