
import React from 'react';
import { Agreement } from '../types';
import { Icons } from '../constants';

interface StakingPoolProps {
  agreements: Agreement[];
}

const StakingPool: React.FC<StakingPoolProps> = ({ agreements }) => {
  const stakedAgreements = agreements.filter(ag => ag.stakingEnabled);
  const totalStaked = stakedAgreements.reduce((sum, ag) => sum + ag.totalAmount, 0);
  const totalYield = stakedAgreements.reduce((sum, ag) => sum + ag.yieldAccrued, 0);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Liquid Staking Pool</h2>
          <p className="text-slate-500 mt-2">Passive yield generation on escrowed Casper assets.</p>
        </div>
        <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl border border-emerald-100">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
          <span className="text-sm font-black uppercase">Live APY: 10.4%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden col-span-1 md:col-span-2">
           <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full -mr-32 -mt-32 blur-[100px]"></div>
           <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-2">Total Yield Accrued</p>
                <h3 className="text-5xl font-black text-white tracking-tighter">
                  {totalYield.toFixed(6)} <span className="text-2xl text-slate-500">CSPR</span>
                </h3>
              </div>
              <div className="mt-12 grid grid-cols-2 gap-8 pt-8 border-t border-slate-800">
                 <div>
                    <p className="text-slate-500 text-[10px] font-black uppercase mb-1">Actively Staked</p>
                    <p className="text-2xl font-bold">{totalStaked.toLocaleString()} <span className="text-sm text-slate-600">CSPR</span></p>
                 </div>
                 <div>
                    <p className="text-slate-500 text-[10px] font-black uppercase mb-1">Staking Nodes</p>
                    <p className="text-2xl font-bold">4 <span className="text-sm text-slate-600">Nodes</span></p>
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-white rounded-[40px] p-10 border border-slate-200 shadow-sm flex flex-col justify-center text-center">
           <div className="w-20 h-20 bg-sky-50 rounded-[32px] flex items-center justify-center text-sky-500 mx-auto mb-6">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
           </div>
           <h4 className="text-xl font-bold text-slate-900">Enterprise Validator</h4>
           <p className="text-slate-500 text-sm mt-2 leading-relaxed">Your funds are protected by Casper's decentralized validator network.</p>
           <button className="mt-8 bg-slate-900 text-white py-3 rounded-2xl font-bold hover:bg-black transition-all">Node Details</button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100">
           <h3 className="text-xl font-bold text-slate-900">Active Yield Streams</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Agreement</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Staked Principal</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Duration</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Yield Accrued</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {stakedAgreements.map(ag => (
                <tr key={ag.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-8 py-6">
                    <p className="font-bold text-slate-800 group-hover:text-sky-600 transition-colors">{ag.title}</p>
                    <p className="text-xs text-slate-400 font-mono">ID: {ag.id}</p>
                  </td>
                  <td className="px-8 py-6 font-bold text-slate-700">{ag.totalAmount.toLocaleString()} CSPR</td>
                  <td className="px-8 py-6 text-sm text-slate-500">22 Days</td>
                  <td className="px-8 py-6 font-black text-emerald-500">+{ag.yieldAccrued.toFixed(4)} CSPR</td>
                  <td className="px-8 py-6 text-right">
                    <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">Active</span>
                  </td>
                </tr>
              ))}
              {stakedAgreements.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-slate-400 font-bold">No agreements currently utilizing liquid staking.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StakingPool;
