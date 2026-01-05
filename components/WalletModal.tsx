
import React, { useState } from 'react';

interface WalletModalProps {
  onClose: () => void;
  onConnect: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ onClose, onConnect }) => {
  const [step, setStep] = useState<'select' | 'connecting'>('select');

  const handleSelect = () => {
    setStep('connecting');
    setTimeout(() => {
      onConnect();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[40px] w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-slate-900">Connect Wallet</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {step === 'select' ? (
          <div className="space-y-4">
            <WalletOption 
              name="Casper Wallet" 
              icon="https://casperwallet.io/favicon.ico" 
              onClick={handleSelect}
            />
            <WalletOption 
              name="CSPR.click" 
              icon="https://cspr.click/favicon.ico" 
              onClick={handleSelect}
              recommended
            />
            <WalletOption 
              name="Ledger" 
              icon="https://www.ledger.com/wp-content/uploads/2021/11/Ledger-Logo.png" 
              onClick={handleSelect}
            />
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center space-y-6 text-center">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 bg-sky-50 rounded-lg"></div>
              </div>
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">Connecting to CSPR.click</p>
              <p className="text-sm text-slate-500 mt-2">Please approve the request in your extension.</p>
            </div>
          </div>
        )}

        <p className="mt-8 text-center text-xs text-slate-400 leading-relaxed px-4">
          By connecting your wallet, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};

const WalletOption: React.FC<{ name: string, icon: string, onClick: () => void, recommended?: boolean }> = ({ name, icon, onClick, recommended }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-5 rounded-3xl border border-slate-100 hover:border-sky-500 hover:bg-sky-50 transition-all group"
  >
    <div className="flex items-center space-x-4">
      <div className="w-10 h-10 bg-white rounded-xl border border-slate-100 p-2 shadow-sm group-hover:scale-110 transition-transform">
        <img src={icon} alt={name} className="w-full h-full object-contain" />
      </div>
      <span className="font-bold text-slate-800">{name}</span>
    </div>
    {recommended && (
      <span className="text-[10px] font-black text-sky-600 bg-sky-100 px-2 py-0.5 rounded-full uppercase">Recommended</span>
    )}
  </button>
);

export default WalletModal;
