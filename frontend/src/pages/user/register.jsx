import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import registration_img from "../../assets/registrationPage.png"; // Your imported image
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Globe
} from "lucide-react";
import API from '../../hooks/api';

const RegisterForm = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        if (error) setError(null);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const { name, email, password } = formData;

        if (!name || !email || !password) return setError('All fields are required.');
        if (!isValidEmail(email)) return setError('Please enter a valid email address.');
        if (password.length < 8) return setError('Password must be at least 8 characters.');

        setIsLoading(true);

        try {
            const res = await API.post('/register', { name, email, password });
            const data = res.data;
            localStorage.setItem('otpSend', 'true');
            localStorage.setItem('email', email);
            navigate('/verifyemail', { state: { data } });
        } 
        catch (err) {
            setError(err?.response?.data?.result || "Registration failed. Try a different email.");
        } 
        finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-50 font-sans">
            
            {/* --- LEFT SIDE: Visual Brand & Image Panel --- */}
            <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-slate-950">
                {/* Background Image with Overlay */}
                <img 
                    src={registration_img} 
                    alt="Join our network" 
                    className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 hover:scale-100 transition-transform duration-1000"
                />
                
                {/* Gradient Overlays for Readability */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/90 via-slate-950/70 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>

                <div className="relative z-10 p-16 flex flex-col justify-between h-full w-full">
                    <div>
                        <div className="flex items-center gap-2 text-white mb-16">
                            <div className="p-2 bg-indigo-600 rounded-lg">
                                <ShieldCheck size={28} />
                            </div>
                            <span className="text-2xl font-black tracking-tighter">Home_Help</span>
                        </div>
                        
                        <div className="space-y-6 max-w-xl">
                            <h2 className="text-6xl font-black text-white leading-tight">
                                Join the network of <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
                                    Local Experts.
                                </span>
                            </h2>
                            <p className="text-slate-300 text-lg leading-relaxed">
                                Whether you're a skilled professional or looking for trusted help, 
                                join our global map today and start connecting with your community.
                            </p>
                        </div>

                        <ul className="mt-12 space-y-5">
                            <BenefitItem text="Create your permanent digital identity" />
                            <BenefitItem text="Secure, verified professional networking" />
                            <BenefitItem text="Real-time map visibility for your services" />
                            <BenefitItem text="Stable daily income through direct discovery" />
                        </ul>
                    </div>

                    <div className="flex items-center gap-4 text-slate-400 text-sm">
                        <div className="flex -space-x-3">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center">
                                    <User size={14} />
                                </div>
                            ))}
                        </div>
                        <p className="font-medium italic">Empowering thousands of daily workers worldwide.</p>
                    </div>
                </div>
            </div>

            {/* --- RIGHT SIDE: Registration Form --- */}
            <div className="w-full lg:w-[45%] flex items-center justify-center p-8 sm:p-16 bg-white shadow-2xl z-20">
                <div className="w-full max-w-md">
                    
                    <div className="mb-10">
                        <div className="lg:hidden flex items-center gap-2 text-indigo-600 mb-8">
                            <ShieldCheck size={24} />
                            <span className="text-xl font-black tracking-tight uppercase">Home_Help</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 mb-2">Create Account</h1>
                        <p className="text-slate-500 font-medium">Get started with your secure account.</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleRegister}>
                        
                        {/* Name Field */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition" size={18} />
                                <input 
                                    id="name" 
                                    type="text" 
                                    placeholder="e.g. Anand Maurya"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all shadow-sm"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition" size={18} />
                                <input 
                                    id="email" 
                                    type="email" 
                                    placeholder="name@example.com"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all shadow-sm"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition" size={18} />
                                <input 
                                    id="password" 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="Min. 8 characters"
                                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all shadow-sm"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                                <button 
                                    type="button"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Error Messaging */}
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-bold animate-pulse">
                                <AlertCircle size={18} /> {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-indigo-600 shadow-xl transition-all active:scale-[0.98] disabled:bg-slate-300 disabled:cursor-not-allowed group"
                        >
                            {isLoading ? (
                                <><Loader2 className="animate-spin" size={20} /> Finalizing Profile...</>
                            ) : (
                                <>Join the Network <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-slate-500 font-medium text-sm">
                            Already part of our community?{' '}
                            <Link to="/login" className="text-indigo-600 font-black hover:text-indigo-700 underline-offset-8 decoration-2 hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* Helper Component for Benefits List */
const BenefitItem = ({ text }) => (
    <li className="flex items-center gap-4 text-slate-200 group">
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
            <CheckCircle2 className="text-indigo-400 group-hover:text-white" size={14} />
        </div>
        <span className="font-semibold text-base">{text}</span>
    </li>
);

export default RegisterForm;