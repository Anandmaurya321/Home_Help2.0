import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  UserCircle, 
  Mail, 
  Lock, 
  Loader2, 
  Terminal, 
  Activity, 
  Key,
  ChevronRight
} from 'lucide-react';
import API from '../../hooks/api';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState({ text: '', isError: false });
    const [isLoading, setIsLoading] = useState(false);

    const adminCheck = async () => {
        if (isLoading) return;
        if (!username || !email) {
            setMessage({ text: 'Authorization fields required.', isError: true });
            return;
        }

        setIsLoading(true);
        setMessage({ text: '', isError: false });

        try {
            
            const res = await API.post("/adminpanel", { username, email });
            
            const data = res.data;

            if (data?.valid === 0) {
                setMessage({ text: data.data || 'Invalid Administrator Credentials', isError: true });
                return;
            }

            if (data?.valid === 1) {
                localStorage.setItem('otpSend', 'true');
                navigate('/admin_veri', { state: { data } });
            }

        } 
        catch (error) {
            setMessage({ text: 'Central Server Connection Failed.', isError: true });
        } 
        finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') adminCheck();
    };

    return (
        <div className="min-h-screen flex bg-[#020617] font-sans selection:bg-amber-500/30 overflow-hidden">
            
            {/* --- LEFT SIDE: SYSTEM MONITORING (Engaging Admin Content) --- */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#020617] p-16 flex-col justify-between relative border-r border-slate-800/50">
                {/* Decorative Grid Effect */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-amber-500/5 to-transparent"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 text-amber-500 mb-16">
                        <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                            <ShieldAlert size={32} />
                        </div>
                        <span className="text-2xl font-black text-white tracking-tighter uppercase italic">Home_Help <span className="text-amber-500 font-normal ml-1">SYSTEMS</span></span>
                    </div>
                    
                    <h2 className="text-6xl font-black text-white leading-tight mb-8 tracking-tighter">
                        Administrative <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600">Command Center.</span>
                    </h2>
                    
                    <div className="space-y-8 max-w-sm">
                        <p className="text-slate-400 text-lg leading-relaxed font-medium">
                            Authorized access only. Log in to manage platform infrastructure and provider verification.
                        </p>
                        
                        <div className="grid gap-6">
                            <AdminFeature 
                                icon={<Activity size={20} className="text-amber-400" />}
                                title="Provider Management"
                                desc="Approve, verify, or suspend service provider credentials."
                            />
                            <AdminFeature 
                                icon={<Terminal size={20} className="text-amber-400" />}
                                title="System Oversight"
                                desc="Monitor real-time map activity and service request queues."
                            />
                            <AdminFeature 
                                icon={<Key size={20} className="text-amber-400" />}
                                title="Security Protocol"
                                desc="Two-factor authentication required for Level 3 access."
                            />
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex items-center gap-4 text-slate-600 text-[10px] font-black tracking-[0.3em] uppercase">
                    <span className="flex items-center gap-2"><div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div> Secure Admin Node</span>
                    <span className="w-12 h-[1px] bg-slate-800"></span>
                    <span>v2.0.4-Gorakhpur</span>
                </div>
            </div>

            {/* --- RIGHT SIDE: SECURE LOGIN FORM --- */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
                {/* Floating Ambient Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="w-full max-w-[400px] relative z-10">
                    <div className="mb-10 text-center lg:text-left">
                        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Vault Access</h1>
                        <p className="text-slate-500 font-medium">Please enter secondary identification credentials.</p>
                    </div>

                    <div className="space-y-5">
                        {/* Username Input */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Admin Username</label>
                            <div className="relative group">
                                <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-amber-500 transition" size={18} />
                                <input 
                                    id="username"
                                    type="text" 
                                    className="w-full pl-12 pr-4 py-4 bg-[#0a0f1e]/80 border border-slate-800 text-white rounded-2xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition placeholder:text-slate-700 shadow-inner"
                                    placeholder="Enter system handle"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Admin Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-amber-500 transition" size={18} />
                                <input 
                                    id="email"
                                    type="email" 
                                    className="w-full pl-12 pr-4 py-4 bg-[#0a0f1e]/80 border border-slate-800 text-white rounded-2xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition placeholder:text-slate-700 shadow-inner"
                                    placeholder="admin@homehelp.systems"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Message Display Area */}
                        {message.text && (
                            <div className={`p-4 rounded-xl text-xs font-bold border animate-in fade-in slide-in-from-top-1 ${
                                message.isError ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-400'
                            }`}>
                                <div className="flex items-center gap-2 uppercase tracking-widest">
                                    <div className={`w-1.5 h-1.5 rounded-full ${message.isError ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                    {message.text}
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button 
                            onClick={adminCheck}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-3 py-4 bg-amber-600 text-black rounded-2xl font-black text-lg hover:bg-amber-500 shadow-2xl shadow-amber-600/10 transition-all active:scale-[0.98] disabled:bg-slate-800 disabled:text-slate-600"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>AUTHORIZE SYSTEM <ChevronRight size={20} /></>
                            )}
                        </button>
                    </div>

                    <p className="mt-8 text-center text-xs text-slate-600 font-bold uppercase tracking-[0.2em] animate-pulse">
                        Encrypted Connection Active
                    </p>
                </div>
            </div>
        </div>
    );
};

const AdminFeature = ({ icon, title, desc }) => (
    <div className="flex gap-4 group">
        <div className="w-10 h-10 shrink-0 bg-slate-800/50 rounded-xl flex items-center justify-center border border-slate-700 group-hover:border-amber-500/50 transition-all duration-300">
            {icon}
        </div>
        <div>
            <h4 className="text-white font-bold text-sm mb-0.5 tracking-tight">{title}</h4>
            <p className="text-slate-500 text-xs leading-relaxed font-medium">{desc}</p>
        </div>
    </div>
);

export default AdminLogin;