
import React from 'react';
import { Agreement, AgreementStatus } from '../types';

interface AgreementCardProps {
  agreement: Agreement;
  onClick: (id: string) => void;
}

const AgreementCard: React.FC<AgreementCardProps> = ({ agreement, onClick }) => {
  const getStatusColor = (status: AgreementStatus) => {
    switch (status) {
      case AgreementStatus.Draft: return 'bg-slate-100 text-slate-600';
      case AgreementStatus.Funded: return 'bg-blue-100 text-blue-600';
      case AgreementStatus.InProgress: return 'bg-amber-100 text-amber-600';
      case AgreementStatus.Review: return 'bg-purple-100 text-purple-600';
      case AgreementStatus.Completed: return 'bg-emerald-100 text-emerald-600';
      case AgreementStatus.Disputed: return 'bg-rose-100 text-rose-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const progress = agreement.milestones.length > 0 
    ? (agreement.milestones.filter(m => m.status === 'Approved').length / agreement.milestones.length) * 100 
    : 0;

  return (
    <div 
      onClick={() => onClick(agreement.id)}
      className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg hover:border-sky-200 transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${getStatusColor(agreement.status)}`}>
            {agreement.status}
          </span>
          <h3 className="mt-2 text-lg font-bold text-slate-800 group-hover:text-sky-600 transition-colors line-clamp-1">
            {agreement.title}
          </h3>
        </div>
        {agreement.stakingEnabled && (
          <div className="flex items-center space-x-1 bg-green-50 text-green-600 px-2 py-1 rounded-lg">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
            </svg>
            <span className="text-[10px] font-bold">STAKED</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-xs font-medium text-slate-500">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-sky-500 transition-all duration-500" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4">
        <div className="flex -space-x-2">
          <img className="w-6 h-6 rounded-full border-2 border-white" src={`https://picsum.photos/seed/${agreement.initiator}/24/24`} alt="Initiator" />
          <img className="w-6 h-6 rounded-full border-2 border-white" src={`https://picsum.photos/seed/${agreement.counterparty}/24/24`} alt="Counterparty" />
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-400 uppercase font-semibold leading-tight">Value</p>
          <p className="text-sm font-bold text-slate-800">{agreement.totalAmount.toLocaleString()} CSPR</p>
        </div>
      </div>
    </div>
  );
};

export default AgreementCard;
