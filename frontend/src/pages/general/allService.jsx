import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Phone, 
  Star, 
  ShieldCheck,
  MessageCircle,
  ArrowRight,
  Loader2,
  SlidersHorizontal
} from "lucide-react";
import API from '../../hooks/api';

const AllService = () => {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchData = async () => {
        setLoading(true);
        try {
            const url = !search || search.trim() === ''
                ? `/allservice`
                : `/allservice/${search}`;

            const res = await API.get(url);
            setData(res.data);
        }
        catch (error) {
            console.error("Fetch failed:", error);
            setData([]);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => fetchData(), 400); // Debounce
        return () => clearTimeout(timer);
    }, [search]);

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                
                {/* --- PAGE HEADER --- */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-indigo-500 font-black uppercase tracking-[0.3em] text-xs">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                            Live Marketplace
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                            Service <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-500">Directory</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 max-w-md font-medium">
                        Securely connect with the top-rated professionals. All providers are admin-verified.
                    </p>
                </div>

                {/* --- SEARCH ARCHITECTURE --- */}
                <div className="flex flex-col md:flex-row gap-4 mb-12">
                    <div className="relative flex-grow group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition" size={20} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name, profession, or location..."
                            className="w-full pl-12 pr-4 py-4 bg-[#0f172a] border border-slate-800 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all shadow-inner"
                        />
                    </div>
                    <button className="flex items-center justify-center gap-2 px-8 py-4 bg-[#0f172a] border border-slate-800 rounded-2xl font-bold text-slate-300 hover:bg-slate-800 transition">
                        <SlidersHorizontal size={18} /> Filters
                    </button>
                </div>

                {/* --- GRID / RESULTS --- */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((n) => <SkeletonCard key={n} />)}
                    </div>
                ) : data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {data.map((item) => (
                            <ServiceCard key={item._id} item={item} navigate={navigate} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-[#0f172a]/30 border border-dashed border-slate-800 rounded-[3rem]">
                        <Search className="mx-auto text-slate-700 mb-4" size={48} />
                        <h3 className="text-xl font-bold text-slate-400">No Professionals Found</h3>
                        <p className="text-slate-600 mt-1">Try adjusting your search terms.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

/* --- SUB-COMPONENT: PROVIDER CARD --- */
const ServiceCard = ({ item, navigate }) => {
    return (
        <div className="group bg-[#0f172a] border border-slate-800/50 rounded-[2.5rem] p-6 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 relative overflow-hidden">
            {/* Glossy Overlay */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition"></div>
            
            <div className="flex justify-between items-start mb-6">
                <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-700 flex items-center justify-center text-white text-2xl font-black shadow-lg">
                        {item.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-[#0f172a] rounded-full"></div>
                </div>
                <div className="text-right">
                    <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-2">
                        {item.service}
                    </span>
                    <div className="flex items-center justify-end gap-1 text-amber-500">
                        <Star size={14} fill="currentColor" />
                        <span className="text-sm font-black">4.9</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition truncate">{item.name}</h3>
                    <div className="flex items-center gap-2 text-slate-500 text-sm mt-1 font-medium">
                        <MapPin size={14} className="text-indigo-500" />
                        <span className="truncate">{item.address}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-800/50">
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase font-black text-slate-600 tracking-widest">Experience</p>
                        <p className="text-xs font-bold text-slate-300 flex items-center gap-1">
                            <Briefcase size={12} /> {item.experience}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase font-black text-slate-600 tracking-widest">Status</p>
                        <p className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                            <ShieldCheck size={12} /> Verified
                        </p>
                    </div>
                </div>

                <div className="pt-2 flex gap-3">
                    <button 
                        onClick={() => navigate(`/review/${item._id}`)}
                        className="flex-1 py-3 bg-slate-800/50 text-slate-400 rounded-xl font-bold text-xs hover:bg-slate-800 hover:text-white transition-all border border-slate-700/50"
                    >
                        Reviews
                    </button>
                    <button 
                        onClick={() => navigate(`/chat`)}
                        className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                        Hire Pro <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

/* --- SKELETON LOADER --- */
const SkeletonCard = () => (
    <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-[2.5rem] animate-pulse">
        <div className="flex justify-between mb-8">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl"></div>
            <div className="w-24 h-6 bg-slate-800 rounded-full"></div>
        </div>
        <div className="h-6 bg-slate-800 rounded w-2/3 mb-3"></div>
        <div className="h-4 bg-slate-800 rounded w-1/2 mb-8"></div>
        <div className="flex gap-3">
            <div className="flex-1 h-12 bg-slate-800 rounded-xl"></div>
            <div className="flex-1 h-12 bg-slate-800 rounded-xl"></div>
        </div>
    </div>
);

export default AllService;