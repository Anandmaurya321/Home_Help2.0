import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Briefcase, 
  Award, 
  Phone, 
  MapPin, 
  Image as ImageIcon, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck,
  Navigation,
  ArrowRight,
  Info
} from "lucide-react";
import API from '../../hooks/api';
import backgroundImage from '../../assets/servicePro_regis.png';

const AddServiceProvider = () => {
    const navigate = useNavigate();
    
    // --- State Management ---
    const [name, setName] = useState("");
    const [experience, setExperience] = useState("");
    const [contact, setContact] = useState("");
    const [service, setService] = useState("");
    const [address, setAddress] = useState("");
    const [location, setLocation] = useState({ latitude: "", longitude: "" });
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // --- Auto-fetch Location on Mount ---
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                },
                (error) => {
                    console.error("Location error:", error);
                }
            );
        }
    }, []);

    const collectData = async (e) => {
        e.preventDefault();

        if (!location.latitude || !location.longitude) {
            alert("Location coordinates are required for the map pin.");
            return;
        }

        if (!image) {
            alert("Please upload a profile photo.");
            return;
        }

        setIsLoading(true);

        const formData = new FormData();
        formData.append('name', name.toUpperCase());
        formData.append('service', service.toUpperCase());
        formData.append('experience', experience.toUpperCase());
        formData.append('contact', contact.toUpperCase());
        formData.append('address', address.toUpperCase());
        formData.append('latitude', location.latitude);
        formData.append('longitude', location.longitude);
        formData.append('image', image);

        try {
            const res = await API.post("/addservicepro", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            const data = res.data.data;
            alert("Application submitted! Pending admin review.");
            navigate('/additional_data', { state: { data } });
        }
        catch (error) {
            alert(error?.response?.data?.message || "Something went wrong!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans overflow-x-hidden">
            
            {/* --- LEFT SIDE: THE PROVIDER PITCH --- */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 p-16 flex-col justify-between overflow-hidden">
                {/* Background Image with sophisticated overlay */}
                <img 
                    src={backgroundImage} 
                    alt="Work with us" 
                    className="absolute inset-0 w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/90 via-slate-950/80 to-transparent"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-white mb-16">
                        <div className="p-2 bg-indigo-600 rounded-lg">
                            <ShieldCheck size={28} />
                        </div>
                        <span className="text-2xl font-black tracking-tighter uppercase">Home_Help</span>
                    </div>

                    <div className="max-w-md">
                        <h2 className="text-5xl font-black text-white leading-tight mb-8">
                            Turn your skills into <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
                                Daily Income.
                            </span>
                        </h2>
                        
                        <div className="space-y-6">
                            <ProviderBenefit icon={<CheckCircle2 className="text-emerald-400" />} text="Get found on our real-time global map" />
                            <ProviderBenefit icon={<CheckCircle2 className="text-emerald-400" />} text="Build reputation with verified reviews" />
                            <ProviderBenefit icon={<CheckCircle2 className="text-emerald-400" />} text="Direct chat with nearby customers" />
                            <ProviderBenefit icon={<CheckCircle2 className="text-emerald-400" />} text="Stabilize your daily work queue" />
                        </div>
                    </div>
                </div>

                <div className="relative z-10 border-t border-white/10 pt-8">
                    <p className="text-slate-400 text-sm italic">
                        "Home_Help has doubled my weekly bookings by making me visible to people just blocks away."
                    </p>
                    <p className="text-white font-bold mt-2">— Local Service Provider</p>
                </div>
            </div>

            {/* --- RIGHT SIDE: THE REGISTRATION FORM --- */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-50 overflow-y-auto">
                <div className="w-full max-w-xl bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 p-8 lg:p-12 border border-slate-100">
                    
                    <div className="mb-10">
                        <h1 className="text-3xl font-black text-slate-900 mb-2">Provider Application</h1>
                        <p className="text-slate-500 font-medium italic">Step 1: Core Professional Details</p>
                    </div>

                    <form onSubmit={collectData} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <div className="md:col-span-2">
                           <InputGroup label="Full Name" id="name" icon={<User size={18}/>} placeholder="e.g. John Doe" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>

                        <InputGroup label="Service Type" id="service" icon={<Briefcase size={18}/>} placeholder="e.g. Electrician" value={service} onChange={(e) => setService(e.target.value)} />
                        
                        <InputGroup label="Exp (Years)" id="experience" icon={<Award size={18}/>} placeholder="e.g. 5 Years" value={experience} onChange={(e) => setExperience(e.target.value)} />
                        
                        <InputGroup label="Contact No." id="contact" type="tel" icon={<Phone size={18}/>} placeholder="123-456-7890" value={contact} onChange={(e) => setContact(e.target.value)} />

                        <div className="md:col-span-2">
                            <InputGroup label="Business Address" id="address" icon={<MapPin size={18}/>} placeholder="Street, City, Postal Code" value={address} onChange={(e) => setAddress(e.target.value)} />
                        </div>

                        {/* Photo Upload Section */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Profile Photo</label>
                            <label className="flex items-center justify-center w-full h-32 px-4 transition bg-slate-50 border-2 border-slate-200 border-dashed rounded-2xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 group">
                                <div className="flex flex-col items-center space-y-2">
                                    <ImageIcon className="w-8 h-8 text-slate-400 group-hover:text-indigo-500" />
                                    <span className="font-medium text-slate-500 text-sm">
                                        {image ? image.name : "Click to upload professional photo"}
                                    </span>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                            </label>
                        </div>

                        {/* Location Badge */}
                        <div className="md:col-span-2 bg-indigo-50 rounded-2xl p-4 flex items-center justify-between border border-indigo-100">
                            <div className="flex items-center gap-3">
                                <div className="bg-indigo-600 p-2 rounded-lg text-white">
                                    <Navigation size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-indigo-400 tracking-tighter leading-none">Map Coordinates</p>
                                    <p className="text-sm font-bold text-slate-700">
                                        {location.latitude ? `${location.latitude.toString().slice(0, 8)}, ${location.longitude.toString().slice(0, 8)}` : "Detecting Location..."}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div> GPS ACTIVE
                            </div>
                        </div>

                        <div className="md:col-span-2 pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-3 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-indigo-600 shadow-xl transition-all active:scale-[0.98] disabled:bg-slate-300 group"
                            >
                                {isLoading ? (
                                    <><Loader2 className="animate-spin" size={22} /> Processing Application...</>
                                ) : (
                                    <>Submit Profile for Review <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" /></>
                                )}
                            </button>
                            <p className="text-center text-slate-400 text-xs mt-4 flex items-center justify-center gap-1 font-medium">
                                <Info size={12}/> Every profile is manually verified by our admin for safety.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// --- Custom Reusable Components ---

const ProviderBenefit = ({ icon, text }) => (
    <div className="flex items-center gap-4 text-slate-200">
        <div className="flex-shrink-0">{icon}</div>
        <span className="font-semibold text-lg">{text}</span>
    </div>
);

const InputGroup = ({ label, id, icon, placeholder, value, onChange, type = "text" }) => (
    <div className="space-y-2">
        <label htmlFor={id} className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{label}</label>
        <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                {icon}
            </div>
            <input 
                id={id} 
                type={type} 
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all shadow-sm text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal"
            />
        </div>
    </div>
);

export default AddServiceProvider;