import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { loginUser } from "../../redux/authRedux";
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  Loader2, 
  MapPin,
  MessageSquare,
  Globe,
  Eye,
  EyeOff,
  Zap
} from "lucide-react";
import API from '../../hooks/api';

const UserLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await API.post("/login", { email, password });
            const data = res.data;

            if (data.success === true) {
                const reduxData = {
                    user: { name: data.name, email: email },
                    isLoggedIn: true,
                    token: data.auth
                };
                dispatch(loginUser(reduxData));
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('name', data.name);
                localStorage.setItem('email', email);
                localStorage.setItem('loginToken', data.auth);
                window.dispatchEvent(new Event('storageChange'));
                navigate('/');
            } else {
                setError(data.message || 'Access Denied. Check your credentials.');
            }
        } 
        catch (err) {
            setError('System error. Please try again shortly.');
        } 
        finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-[#020617] font-sans selection:bg-indigo-500/30">
            
            {/* --- LEFT SIDE: BRAND IMPACT (Global Focus) --- */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0f172a] to-[#020617] p-16 flex-col justify-between relative border-r border-slate-800/50 overflow-hidden">
                {/* Background Glow */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px]"></div>

                <div className="relative z-10">
                    <Link to="/" className="flex items-center gap-3 text-indigo-500 mb-16 hover:opacity-80 transition">
                        <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
                            <ShieldCheck size={32} />
                        </div>
                        <span className="text-2xl font-black text-white tracking-tighter italic">Home_Help</span>
                    </Link>
                    
                    <h2 className="text-6xl font-black text-white leading-[1.1] mb-8 tracking-tighter">
                        Reconnect with <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-500 to-emerald-400">
                            Expert Solutions.
                        </span>
                    </h2>
                    
                    <div className="space-y-8 max-w-md">
                        <p className="text-slate-400 text-lg leading-relaxed font-medium">
                            Welcome back! Log in to access your dashboard and connect with verified service providers across the globe.
                        </p>
                        
                        <div className="grid gap-6">
                            <LoginFeature 
                                icon={<Globe className="text-blue-400" size={20} />}
                                title="Global Mapping"
                                desc="Find providers wherever you are with our real-time interactive world map."
                            />
                            <LoginFeature 
                                icon={<MessageSquare className="text-indigo-400" size={20} />}
                                title="Encrypted Communication"
                                desc="Safe, secure, and instant chat with full conversation history."
                            />
                            <LoginFeature 
                                icon={<Zap className="text-emerald-400" size={20} />}
                                title="Verified Quality"
                                desc="Connect with professionals manually reviewed by our security team."
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Metadata */}
                <div className="relative z-10 flex items-center gap-4 text-slate-600 text-[10px] font-black tracking-[0.2em] uppercase">
                    <span>Global Service Network</span>
                    <span className="w-12 h-[1px] bg-slate-800"></span>
                    <span>Secure JWT Protocol</span>
                </div>
            </div>

            {/* --- RIGHT SIDE: LOGIN FORM --- */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-bottom-4 duration-700">
                    
                    <div className="mb-10 text-center lg:text-left">
                        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Login</h1>
                        <p className="text-slate-500 font-medium">Access your global service dashboard.</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleLogin}>
                        {/* Email Input */}
                        <div className="space-y-2 group">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-indigo-400 transition-colors">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-indigo-500" size={18} />
                                <input 
                                    type="email" 
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-[#0a0f1e] border border-slate-800 text-white rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-700 shadow-inner"
                                    placeholder="e.g. anand@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2 group">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-focus-within:text-indigo-400 transition-colors">Password</label>
                                <Link to="/userforgotpassword" size="sm" className="text-[10px] font-black text-indigo-500 hover:text-indigo-400 uppercase tracking-tighter">Forgot Password?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-indigo-500" size={18} />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    required
                                    className="w-full pl-12 pr-12 py-4 bg-[#0a0f1e] border border-slate-800 text-white rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-700 shadow-inner"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button 
                                    type="button"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-indigo-500 transition"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Error Handling */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-xs font-bold animate-pulse flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-3 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-500 shadow-xl shadow-indigo-600/10 transition-all active:scale-[0.98] disabled:bg-slate-800 disabled:cursor-not-allowed group"
                        >
                            {isLoading ? (
                                <><Loader2 className="animate-spin" size={20} /> Verifying...</>
                            ) : (
                                <>Secure Login <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 text-center border-t border-slate-800/50 pt-8">
                        <p className="text-slate-500 font-medium text-sm">
                            New to Home_Help?{' '}
                            <Link to="/register" className="text-indigo-400 font-black hover:text-indigo-300 transition-colors underline-offset-4 hover:underline">
                                Create Global Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* Reusable Feature Component */
const LoginFeature = ({ icon, title, desc }) => (
    <div className="flex gap-4 group">
        <div className="w-10 h-10 shrink-0 bg-slate-800/50 rounded-xl flex items-center justify-center border border-slate-700 group-hover:border-indigo-500 transition-all shadow-inner group-hover:bg-indigo-500/5">
            {icon}
        </div>
        <div>
            <h4 className="text-white font-bold text-sm mb-0.5 group-hover:text-indigo-400 transition-colors">{title}</h4>
            <p className="text-slate-500 text-xs leading-relaxed font-medium">{desc}</p>
        </div>
    </div>
);

export default UserLogin;