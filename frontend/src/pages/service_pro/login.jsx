import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  ShieldCheck, 
  ArrowRight,
  AlertCircle,
  Briefcase,
  TrendingUp,
  UserCheck
} from "lucide-react";
import API from '../../hooks/api';

const ProviderLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (!email || !password) {
            setError('Please fill in both fields.');
            setIsLoading(false);
            return;
        }

        try {
            const res = await API.post("/servicepro_login", { email, password });
            const data = res.data;

            if (data.success === true) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('name', data.name);
                localStorage.setItem('email', email);
                localStorage.setItem('loginToken', data.auth);
                localStorage.setItem('ServicePro', 'true');
                
                window.dispatchEvent(new Event('storageChange'));
                navigate('/');
            } else {
                setError(data.message || 'Invalid credentials. Please try again.');
            }
        } 
        catch (err) {
            setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
        } 
        finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-[#020617] font-sans">
            
            {/* --- LEFT SIDE: THE BUSINESS VALUE (For Pros) --- */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0f172a] to-[#020617] p-16 flex-col justify-between relative border-r border-slate-800/50 overflow-hidden">
                {/* Visual Glow */}
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 text-blue-500 mb-16">
                        <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                            <Briefcase size={32} />
                        </div>
                        <span className="text-2xl font-black text-white tracking-tighter italic">Home_Help </span>
                    </div>
                    
                    <h2 className="text-6xl font-black text-white leading-tight mb-8 tracking-tighter">
                        Manage Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Service Empire.</span>
                    </h2>
                    
                    <div className="space-y-8 max-w-md">
                        <p className="text-slate-400 text-lg leading-relaxed font-medium">
                            Log in to view your active job queue, respond to customer messages, and update your real-time location.
                        </p>
                        
                        <div className="grid gap-6">
                            <ProBenefit 
                                icon={<TrendingUp className="text-blue-400" size={20} />}
                                title="Scale Your Daily Wages"
                                desc="See incoming requests from households near your current location."
                            />
                            <ProBenefit 
                                icon={<UserCheck className="text-indigo-400" size={20} />}
                                title="Verified Pro Status"
                                desc="Maintain your admin-verified profile to build trust with local users."
                            />
                            <ProBenefit 
                                icon={<ShieldCheck className="text-emerald-400" size={20} />}
                                title="Secure Business Tools"
                                desc="Negotiate and finalize deals through our secure, encrypted chat system."
                            />
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex items-center gap-4 text-slate-600 text-[10px] font-black tracking-[0.2em] uppercase">
                    <span>Provider Network India</span>
                    <span className="w-12 h-[1px] bg-slate-800"></span>
                    <span>Admin Level Security</span>
                </div>
            </div>

            {/* --- RIGHT SIDE: LOGIN FORM --- */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-[400px]">
                    
                    <div className="mb-10 text-center lg:text-left">
                        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Provider Dashboard</h1>
                        <p className="text-slate-500 font-medium italic">"Empowering local heroes with daily jobs"</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleLogin}>
                        {/* Email Address */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Work Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition" size={18} />
                                <input 
                                    type="email" 
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-[#0a0f1e] border border-slate-800 text-white rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition placeholder:text-slate-700"
                                    placeholder="Enter your pro email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Secret Key</label>
                                <button type="button" onClick={() => navigate('/serviceproForgotPassword')} className="text-[10px] font-bold text-blue-400 hover:text-blue-300 uppercase">Recovery?</button>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition" size={18} />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    required
                                    className="w-full pl-12 pr-12 py-4 bg-[#0a0f1e] border border-slate-800 text-white rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition placeholder:text-slate-700"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button 
                                    type="button"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-blue-500 transition"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-xs font-bold animate-in fade-in">
                                <AlertCircle size={14} /> {error}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-3 py-4 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-500 shadow-2xl shadow-blue-600/20 transition-all active:scale-[0.98] disabled:bg-slate-800 disabled:text-slate-500"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <>SIGN IN TO WORK <ArrowRight size={20} /></>}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-slate-800/50 pt-8">
                        <p className="text-slate-500 font-medium text-sm">
                            Need a provider account?{' '}
                            <Link to="/register" className="text-blue-400 font-black hover:text-blue-300 transition">
                                Join the Network
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProBenefit = ({ icon, title, desc }) => (
    <div className="flex gap-4 group">
        <div className="w-10 h-10 shrink-0 bg-slate-800/50 rounded-xl flex items-center justify-center border border-slate-700 group-hover:border-blue-500 transition shadow-inner">
            {icon}
        </div>
        <div>
            <h4 className="text-white font-bold text-sm mb-0.5">{title}</h4>
            <p className="text-slate-500 text-xs leading-relaxed font-medium">{desc}</p>
        </div>
    </div>
);

export default ProviderLogin;

