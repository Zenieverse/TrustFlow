
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface SettingsProps {
  user: User;
}

type SettingsTab = 'Profile' | 'Network' | 'Security' | 'Notifications' | 'Advanced';

const Settings: React.FC<SettingsProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('Profile');
  const [displayName, setDisplayName] = useState('Enterprise User');
  const [email, setEmail] = useState('contact@enterprise.io');
  const [autoStake, setAutoStake] = useState(false);
  const [rpcNode, setRpcNode] = useState('https://rpc.testnet.casper.live');
  const [networkType, setNetworkType] = useState('Testnet');
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [notifications, setNotifications] = useState({
    milestone: true,
    dispute: true,
    yield: false,
    marketing: false
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\S@"]+(\.[^<>()[\]\\.,;:\S@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSave = () => {
    setError(null);
    if (activeTab === 'Profile' && !validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSaving(true);
    // Simulate API persistence
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1200);
  };

  const handleDiscard = () => {
    setDisplayName('Enterprise User');
    setEmail('contact@enterprise.io');
    setAutoStake(false);
    setRpcNode('https://rpc.testnet.casper.live');
    setNetworkType('Testnet');
    setError(null);
  };

  const renderProfileTab = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
      <section className="space-y-6">
        <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Profile Information</h3>
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 rounded-3xl bg-slate-100 border-4 border-white shadow-lg overflow-hidden relative group">
            <img src={`https://picsum.photos/seed/${user.address}/80/80`} alt="Avatar" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Public Account Key</p>
            <p className="text-sm font-mono text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 truncate">{user.address}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Display Name</label>
            <input 
              type="text" 
              className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all" 
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your organization name"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Email (Notifications)</label>
            <input 
              type="email" 
              className={`w-full px-5 py-3 rounded-2xl border ${error && !validateEmail(email) ? 'border-rose-300 bg-rose-50' : 'border-slate-200'} focus:ring-2 focus:ring-sky-500/20 outline-none transition-all`} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alerts@domain.com"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Escrow Preferences</h3>
        <div 
          className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 cursor-pointer hover:bg-slate-100/50 transition-all"
          onClick={() => setAutoStake(!autoStake)}
        >
          <div>
            <p className="font-bold text-slate-800">Auto-Stake Escrow</p>
            <p className="text-xs text-slate-500">Automatically enable liquid staking for all new agreements.</p>
          </div>
          <button className={`w-12 h-6 rounded-full relative transition-all ${autoStake ? 'bg-sky-500' : 'bg-slate-300'}`}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${autoStake ? 'left-7' : 'left-1'}`}></div>
          </button>
        </div>

        <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
          <div>
            <p className="font-bold text-slate-800">Global Arbitrator</p>
            <p className="text-xs text-slate-500">Default DAO or account used for dispute resolution.</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-mono text-sky-600 font-bold underline cursor-pointer">TrustFlow-DAO v1.2</p>
            <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">Standard Enterprise Path</p>
          </div>
        </div>
      </section>
    </div>
  );

  const renderNetworkTab = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <section className="space-y-6">
        <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Casper Node Configuration</h3>
        <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex items-start space-x-4">
          <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <div>
            <p className="text-sm font-bold text-amber-800">Advanced Users Only</p>
            <p className="text-xs text-amber-700 mt-1">Changing these settings will affect how TrustFlow communicates with the blockchain. Use verified endpoints only.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Network Selection</label>
            <div className="flex space-x-3 p-1.5 bg-slate-100 rounded-2xl w-fit">
              {['Mainnet', 'Testnet', 'Private'].map(type => (
                <button 
                  key={type}
                  onClick={() => setNetworkType(type)}
                  className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${networkType === type ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">RPC Endpoint URL</label>
            <div className="flex space-x-3">
              <input 
                type="text" 
                className="flex-1 px-5 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-sky-500/20 outline-none font-mono text-sm" 
                value={rpcNode}
                onChange={(e) => setRpcNode(e.target.value)}
              />
              <button className="px-6 bg-slate-100 text-slate-600 rounded-2xl font-bold text-xs hover:bg-slate-200 transition-all">Test Connection</button>
            </div>
          </div>
        </div>
      </section>

      <section className="p-6 bg-slate-900 rounded-[32px] text-white">
        <h4 className="font-bold mb-4 flex items-center space-x-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span>Node Telemetry</span>
        </h4>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Latency</p>
            <p className="text-2xl font-black">24ms</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Protocol Version</p>
            <p className="text-2xl font-black">1.5.2</p>
          </div>
        </div>
      </section>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <section className="space-y-6">
        <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Security & Access Control</h3>
        
        <div className="space-y-4">
          <SecurityOption 
            title="Session Persistence" 
            desc="Keep the wallet connected even after browser restart." 
            active={true}
          />
          <SecurityOption 
            title="Biometric Signature" 
            desc="Require local device authentication for small CSPR releases." 
            active={false}
          />
          <SecurityOption 
            title="Two-Factor (2FA) Webhooks" 
            desc="Receive an SMS or email code for releases over 5,000 CSPR." 
            active={false}
          />
        </div>

        <div className="pt-6">
           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Inactivity Timeout (Minutes)</label>
           <select 
             value={sessionTimeout}
             onChange={(e) => setSessionTimeout(e.target.value)}
             className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-sky-500/20 outline-none"
           >
              <option value="15">15 Minutes</option>
              <option value="30">30 Minutes</option>
              <option value="60">1 Hour</option>
              <option value="0">Never (Unsafe)</option>
           </select>
        </div>
      </section>

      <section className="p-8 bg-rose-50 border border-rose-100 rounded-[32px] space-y-4">
         <h4 className="text-rose-800 font-bold">Revoke Session Keys</h4>
         <p className="text-xs text-rose-700 leading-relaxed">If you suspect your local environment is compromised, revoke all session keys immediately. This will disconnect all active agreements and require a hard wallet signature to re-enable.</p>
         <button className="bg-rose-500 text-white px-8 py-3 rounded-2xl font-bold text-sm hover:bg-rose-600 shadow-lg shadow-rose-200 transition-all">Emergency Revocation</button>
      </section>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <section className="space-y-6">
        <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Alert Preferences</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between group">
            <div className="max-w-[80%]">
              <p className="font-bold text-slate-800">Agreement Lifecycle</p>
              <p className="text-xs text-slate-500">Milestone approvals, contract funding, and completions.</p>
            </div>
            <Toggle 
              active={notifications.milestone} 
              onToggle={() => setNotifications({...notifications, milestone: !notifications.milestone})} 
            />
          </div>
          
          <div className="flex items-center justify-between group">
            <div className="max-w-[80%]">
              <p className="font-bold text-slate-800">Dispute Alerts</p>
              <p className="text-xs text-slate-500">Instant notification if any party initiates a formal dispute.</p>
            </div>
            <Toggle 
              active={notifications.dispute} 
              onToggle={() => setNotifications({...notifications, dispute: !notifications.dispute})} 
            />
          </div>

          <div className="flex items-center justify-between group">
            <div className="max-w-[80%]">
              <p className="font-bold text-slate-800">Staking Payouts</p>
              <p className="text-xs text-slate-500">Weekly reports on yield earned from escrowed assets.</p>
            </div>
            <Toggle 
              active={notifications.yield} 
              onToggle={() => setNotifications({...notifications, yield: !notifications.yield})} 
            />
          </div>

          <div className="flex items-center justify-between group">
            <div className="max-w-[80%]">
              <p className="font-bold text-slate-800">TrustFlow Insights</p>
              <p className="text-xs text-slate-500">Occasional updates on new platform features and Casper Network news.</p>
            </div>
            <Toggle 
              active={notifications.marketing} 
              onToggle={() => setNotifications({...notifications, marketing: !notifications.marketing})} 
            />
          </div>
        </div>
      </section>
    </div>
  );

  const renderAdvancedTab = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <section className="space-y-6">
        <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Advanced Configuration</h3>
        
        <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 space-y-4">
           <h4 className="font-bold text-slate-800">Data Management</h4>
           <p className="text-xs text-slate-500 leading-relaxed">Export your entire agreement history as a signed PDF or JSON object for tax and auditing purposes.</p>
           <div className="flex space-x-3">
             <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold hover:bg-slate-50 transition-all">Export JSON</button>
             <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold hover:bg-slate-50 transition-all">Generate Audit Report</button>
           </div>
        </div>

        <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 space-y-4">
           <h4 className="font-bold text-slate-800">Platform Analytics</h4>
           <div className="flex items-center justify-between group cursor-pointer">
              <div>
                <p className="text-sm font-bold text-slate-700">Developer Mode</p>
                <p className="text-xs text-slate-500">Enable raw JSON visualization in agreement details.</p>
              </div>
              <Toggle active={false} onToggle={() => {}} />
           </div>
        </div>
      </section>

      <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
         <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Platform Version: v1.8.4-stable</p>
         <button className="text-rose-500 text-xs font-bold hover:underline">Delete Local Cache</button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 relative">
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-8 py-4 rounded-3xl font-bold shadow-2xl flex items-center space-x-4 animate-in slide-in-from-bottom-10 duration-500">
          <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-sm">Settings successfully synchronized to Casper local state.</span>
        </div>
      )}

      <div className="text-center">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Platform Configuration</h2>
        <p className="text-slate-500 mt-2 font-medium">Manage your Casper identity, network nodes, and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Navigation Sidebar */}
        <div className="space-y-3">
           <SettingsNavItem label="Account Profile" active={activeTab === 'Profile'} onClick={() => setActiveTab('Profile')} icon="👤" />
           <SettingsNavItem label="Casper Network" active={activeTab === 'Network'} onClick={() => setActiveTab('Network')} icon="⛓️" />
           <SettingsNavItem label="Security & Keys" active={activeTab === 'Security'} onClick={() => setActiveTab('Security')} icon="🛡️" />
           <SettingsNavItem label="Notifications" active={activeTab === 'Notifications'} onClick={() => setActiveTab('Notifications')} icon="🔔" />
           <SettingsNavItem label="Advanced Tools" active={activeTab === 'Advanced'} onClick={() => setActiveTab('Advanced')} icon="⚙️" />
           
           <div className="pt-10 px-6">
              <div className="bg-sky-50 p-6 rounded-[28px] border border-sky-100">
                 <p className="text-[10px] font-black text-sky-600 uppercase tracking-widest mb-2">Connected Tier</p>
                 <p className="text-sm font-bold text-sky-900">Enterprise Partner</p>
                 <p className="text-[10px] text-sky-700 mt-1">Verified on Casper Mainnet</p>
              </div>
           </div>
        </div>

        {/* Content Panel */}
        <div className="md:col-span-2 bg-white rounded-[48px] border border-slate-200 p-10 shadow-xl shadow-slate-200/50 min-h-[600px] flex flex-col relative overflow-hidden">
           {error && (
             <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl mb-6 text-xs font-bold border border-rose-100 flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{error}</span>
             </div>
           )}

           <div className="flex-1">
             {activeTab === 'Profile' && renderProfileTab()}
             {activeTab === 'Network' && renderNetworkTab()}
             {activeTab === 'Security' && renderSecurityTab()}
             {activeTab === 'Notifications' && renderNotificationsTab()}
             {activeTab === 'Advanced' && renderAdvancedTab()}
           </div>

           {/* Persistent Save Bar for all relevant tabs */}
           <div className="pt-10 mt-10 border-t border-slate-100 flex justify-end space-x-4 bg-white sticky bottom-0 z-10">
              <button 
                onClick={handleDiscard}
                className="px-8 py-3.5 rounded-[20px] font-bold text-slate-500 hover:bg-slate-50 transition-all text-sm"
              >
                Reset Defaults
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="bg-slate-900 text-white px-10 py-3.5 rounded-[20px] font-bold shadow-2xl transition-all hover:bg-black flex items-center space-x-3 text-sm"
              >
                {isSaving && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>}
                <span>{isSaving ? 'Synchronizing...' : 'Apply Changes'}</span>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

const Toggle: React.FC<{ active: boolean, onToggle: () => void }> = ({ active, onToggle }) => (
  <button 
    onClick={onToggle}
    className={`w-12 h-6 rounded-full relative transition-all duration-300 ${active ? 'bg-sky-500 shadow-inner' : 'bg-slate-200'}`}
  >
    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${active ? 'left-7' : 'left-1'}`}></div>
  </button>
);

const SecurityOption: React.FC<{ title: string, desc: string, active: boolean }> = ({ title, desc, active }) => (
  <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-md transition-all cursor-pointer group">
    <div className="max-w-[80%]">
      <p className="font-bold text-slate-800">{title}</p>
      <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
    </div>
    <Toggle active={active} onToggle={() => {}} />
  </div>
);

const SettingsNavItem: React.FC<{ label: string, active?: boolean, onClick: () => void, icon: string }> = ({ label, active, onClick, icon }) => (
  <button 
    onClick={onClick}
    className={`w-full text-left px-8 py-4 rounded-[24px] text-sm font-bold transition-all flex items-center space-x-4 ${
      active 
        ? 'bg-sky-500 text-white shadow-2xl shadow-sky-500/30 transform scale-[1.02]' 
        : 'text-slate-500 hover:bg-white hover:text-slate-800 hover:shadow-sm'
    }`}
  >
    <span className="text-lg">{icon}</span>
    <span>{label}</span>
  </button>
);

export default Settings;
