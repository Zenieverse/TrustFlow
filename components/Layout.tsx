
import React from 'react';
import { Icons } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userAddress: string;
  isConnected: boolean;
  onConnect: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, userAddress, isConnected, onConnect }) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800">
        <div className="p-8 flex items-center space-x-3">
          <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-sky-500/20">T</div>
          <span className="text-2xl font-bold text-white tracking-tight">TrustFlow</span>
        </div>
        
        <nav className="flex-1 px-6 py-4 space-y-2">
          <SidebarLink 
            icon={<Icons.Dashboard />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <SidebarLink 
            icon={<Icons.Agreement />} 
            label="My Agreements" 
            active={activeTab === 'agreements'} 
            onClick={() => setActiveTab('agreements')} 
          />
          <SidebarLink 
            icon={<Icons.Wallet />} 
            label="Staking Pool" 
            active={activeTab === 'staking'} 
            onClick={() => setActiveTab('staking')} 
          />
          <SidebarLink 
            icon={<Icons.Settings />} 
            label="Settings" 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
          />
        </nav>

        <div className="p-6 mt-auto">
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 backdrop-blur-sm">
            <p className="text-[10px] text-slate-500 mb-2 uppercase font-black tracking-widest">Network Status</p>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <p className="text-sm text-slate-200 font-bold">Casper Testnet</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-slate-50">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-40">
          <h1 className="text-xl font-bold text-slate-800 capitalize tracking-tight">
            {activeTab === 'dashboard' ? 'Market Overview' : activeTab.replace('-', ' ')}
          </h1>
          
          <div className="flex items-center space-x-6">
            {!isConnected ? (
              <button 
                onClick={onConnect}
                className="bg-slate-900 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-black transition-all shadow-lg"
              >
                Connect Wallet
              </button>
            ) : (
              <div className="flex items-center space-x-4 bg-slate-100 rounded-2xl px-4 py-2 border border-slate-200">
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Account</p>
                  <p className="text-xs font-mono text-slate-800 truncate w-24 leading-relaxed">{userAddress}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 shadow-sm border-2 border-white overflow-hidden flex items-center justify-center text-white font-bold">
                   {userAddress.slice(2, 4).toUpperCase()}
                </div>
              </div>
            )}
          </div>
        </header>
        
        <div className="p-10 flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

const SidebarLink: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-4 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
      active 
        ? 'bg-sky-500 text-white shadow-xl shadow-sky-500/20' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
    }`}
  >
    <div className={`${active ? 'text-white' : 'text-slate-500 group-hover:text-slate-200'}`}>
      {icon}
    </div>
    <span>{label}</span>
  </button>
);

export default Layout;
