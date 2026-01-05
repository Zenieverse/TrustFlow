
import React from 'react';
import { Icons } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userAddress: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, userAddress }) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800">
        <div className="p-6 flex items-center space-x-2">
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center text-white font-bold">T</div>
          <span className="text-xl font-bold text-white tracking-tight">TrustFlow</span>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1">
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

        <div className="p-4 mt-auto border-t border-slate-800">
          <div className="bg-slate-800 rounded-xl p-3">
            <p className="text-xs text-slate-500 mb-1 uppercase font-semibold">Active Account</p>
            <p className="text-sm text-sky-400 font-mono truncate">{userAddress}</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-lg font-semibold text-slate-800 capitalize">{activeTab.replace('-', ' ')}</h1>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-1.5 rounded-full text-sm font-medium transition-colors">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>Casper Testnet</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
               <img src="https://picsum.photos/seed/user1/32/32" alt="avatar" />
            </div>
          </div>
        </header>
        
        <div className="p-8 flex-1 overflow-auto bg-slate-50">
          {children}
        </div>
      </main>
    </div>
  );
};

const SidebarLink: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
      active 
        ? 'bg-sky-600/10 text-sky-400 border-l-4 border-sky-500' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default Layout;
