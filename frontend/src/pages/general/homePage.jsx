import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  MessageSquare,
  ShieldCheck,
  Search,
  ArrowRight,
  Globe,
  Lock,
  Users,
  Star,
  Zap,
  TrendingUp,
  Store
} from "lucide-react";

// Asset imports
import landingImg from "../../assets/landing_page.png";
import map from "../../assets/map.jpg";
import worker from "../../assets/worker.png";
import electrician from "../../assets/electrician.png";
import plumber from "../../assets/plumber.jpg";

const Home_page = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    { img: landingImg, title: "Your Local Service Hub" },
    { img: worker, title: "Empowering Skilled Workers" },
    { img: electrician, title: "Verified Professional Help" },
    { img: plumber, title: "Instant Home Solutions" },
    { img: map, title: "Global Interactive Mapping" },
  ];

  // Auto-slide logic
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-indigo-500/30 font-sans">
      
      {/* ================= HERO SECTION ================= */}
      <section className="container mx-auto px-6 pt-16 pb-24 lg:pt-32 lg:pb-32">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 space-y-8 text-center lg:text-left animate-in fade-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Now Live: Global Service Discovery
            </div>

            <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight">
              Bridging the Gap Between 
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-500 to-emerald-400">
                Skill & Opportunity.
              </span>
            </h1>

            <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              <strong className="text-slate-200">Home_Help</strong> is a MERN-powered ecosystem designed to stabilize daily wages for workers while providing instant, verified home solutions for users worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-4">
              <Link
                to="/allservice"
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-white flex items-center gap-2 justify-center transition-all shadow-lg shadow-indigo-500/25 active:scale-95"
              >
                Find Expert Help <Search size={18} />
              </Link>

              <Link
                to="/register"
                className="px-8 py-4 border border-slate-700 rounded-xl font-bold text-white hover:bg-slate-800 transition active:scale-95"
              >
                Join as Provider
              </Link>
            </div>
          </div>

          {/* Dynamic Image Slider */}
          <div className="lg:w-1/2 relative w-full aspect-square max-w-[600px]">
            <div className="absolute -inset-10 bg-indigo-600/10 blur-[100px] rounded-full"></div>
            <div className="relative h-full w-full overflow-hidden rounded-3xl border border-slate-800 shadow-2xl">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === activeSlide ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <img
                    src={slide.img}
                    alt={slide.title}
                    className="h-full w-full object-cover object-center transform scale-105"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                    <p className="text-white font-bold text-xl">{slide.title}</p>
                  </div>
                </div>
              ))}
              
              {/* Slider Dots */}
              <div className="absolute bottom-4 right-8 flex gap-2">
                {slides.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all ${i === activeSlide ? "w-8 bg-indigo-500" : "w-2 bg-white/30"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= KEY FEATURES (The "Big Three") ================= */}
      <section className="bg-[#0f172a]/40 py-24 border-y border-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-black text-white mb-4">The Home_Help Advantage</h2>
            <p className="text-slate-400">Everything you need to find work or find help, all in one secure place.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <HighlightCard
              icon={<Zap size={32} className="text-yellow-400" />}
              title="Find Expert Help Instantly"
              desc="No more waiting or asking neighbors. Access a vetted directory of plumbers, teachers, and electricians ready to work when you are."
            />
            <HighlightCard
              icon={<MapPin size={32} className="text-rose-400" />}
              title="Live Interactive Map"
              desc="Powered by Leaflet. Pinpoint the exact real-time location of providers worldwide. Real-world mapping ensures transparency and trust."
            />
            <HighlightCard
              icon={<TrendingUp size={32} className="text-emerald-400" />}
              title="Secure Daily Wages"
              highlight={true}
              desc="We solve the 'Empty Day' problem. Providers get a digital storefront to build their reputation, name, and consistent daily income."
            />
          </div>
        </div>
      </section>

      {/* ================= COMMUNITY FOCUS ================= */}
      <section className="container mx-auto px-6 py-28">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2 order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <StatBox icon={<Store />} title="Small Businesses" text="Street vendors & local cafes" />
                <StatBox icon={<Users />} title="Skilled Labor" text="Carpenters & Electricians" />
              </div>
              <div className="space-y-4">
                <StatBox icon={<ShieldCheck />} title="Admin Verified" text="100% Manual screening" />
                <StatBox icon={<Star />} title="Reputation" text="Real reviews & ratings" />
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 space-y-6 order-1 lg:order-2">
            <h2 className="text-4xl font-black text-white leading-tight">
              More Than Just An App — <br/>
              <span className="text-indigo-400">A Digital Identity.</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              For too long, skilled daily workers have remained invisible. Home_Help gives name and fame to small businesses—from fruit sellers to freelance teachers. By registering, you create a permanent pin on the world map where clients can find you, chat with you, and hire you instantly.
            </p>
            <blockquote className="border-l-4 border-indigo-500 pl-6 py-2 italic text-xl text-slate-200">
              “Stabilizing daily income for workers and providing instant home solutions.”
            </blockquote>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="bg-[#0f172a]/40 py-24 border-y border-slate-900">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <h3 className="text-4xl font-black text-white tracking-tight">
              Simple, Transparent & Secure
            </h3>
            <div className="space-y-8">
              <Step num="01" title="Discover" text="Use the interactive map to see real-time locations of service providers near you, anywhere in the world." />
              <Step num="02" title="Evaluate" text="Browse detailed profiles featuring age, experience, mobile numbers, and authentic user reviews." />
              <Step num="03" title="Connect" text="Chat directly through our secure MERN-based messaging system with full history and privacy controls." />
            </div>
          </div>

          <div className="bg-[#020617] border border-slate-800 rounded-3xl p-10 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Lock size={120}/></div>
            <h4 className="text-2xl font-bold text-white">Platform Security</h4>
            <InfoRow icon={<Lock className="text-indigo-400" />} title="JWT Authentication" text="Secure sessions and encrypted data handling." />
            <InfoRow icon={<ShieldCheck className="text-emerald-400" />} title="Admin Approval" text="Every provider is manually vetted to prevent fraud." />
            <InfoRow icon={<Globe className="text-blue-400" />} title="Email Verification" text="Ensuring a community of real, reachable people." />
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="container mx-auto px-6 py-24">
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 rounded-[3rem] p-12 lg:p-20 text-center space-y-8 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
          <h3 className="text-4xl lg:text-6xl font-black text-white relative z-10">
            Ready to find your <br/> next job or expert?
          </h3>
          <p className="text-indigo-100 max-w-xl mx-auto text-lg relative z-10">
            Join the Home_Help community today and experience the future of local service discovery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link to="/allservice" className="px-10 py-5 bg-white text-indigo-900 rounded-2xl font-black hover:bg-slate-100 transition shadow-xl">
              Explore Map
            </Link>
            <Link to="/addservicepro" className="px-10 py-5 bg-indigo-900/40 backdrop-blur-md border border-indigo-400/30 text-white rounded-2xl font-black hover:bg-indigo-900/60 transition flex items-center gap-2 justify-center">
              Register as Provider <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#010413] border-t border-slate-900 py-16 text-center text-slate-500">
        <div className="container mx-auto px-6">
          <h4 className="text-3xl font-black text-white mb-4 tracking-tighter">Home_Help</h4>
          <p className="italic max-w-md mx-auto mb-8">
            Empowering the global workforce, one local connection at a time.
          </p>
          <div className="flex justify-center gap-6 mb-8 text-sm font-bold uppercase tracking-widest text-slate-400">
            <Link to="/" className="hover:text-indigo-400">Home</Link>
            <Link to="/allservice" className="hover:text-indigo-400">Services</Link>
            <Link to="/about" className="hover:text-indigo-400">About</Link>
            <Link to="/contact" className="hover:text-indigo-400">Support</Link>
          </div>
          <p className="text-xs opacity-50">
            © 2025 Home_Help Platform • Built with MERN Stack & Leaflet Maps
          </p>
        </div>
      </footer>
    </div>
  );
};

/* ================= HELPER COMPONENTS ================= */

const HighlightCard = ({ icon, title, desc, highlight = false }) => (
  <div className={`p-8 rounded-3xl border transition-all duration-300 group ${
    highlight 
    ? "bg-indigo-600/10 border-indigo-500/50 shadow-lg shadow-indigo-500/10" 
    : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
  }`}>
    <div className="mb-6 transform group-hover:scale-110 transition-transform">{icon}</div>
    <h4 className="text-xl font-bold text-white mb-3">{title}</h4>
    <p className="text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

const StatBox = ({ icon, title, text }) => (
  <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl hover:bg-slate-800 transition">
    <div className="text-indigo-400 mb-3">{icon}</div>
    <div className="text-lg font-bold text-white">{title}</div>
    <div className="text-sm text-slate-500">{text}</div>
  </div>
);

const Step = ({ num, title, text }) => (
  <div className="flex gap-6 group">
    <span className="text-6xl font-black text-slate-800/50 group-hover:text-indigo-500/20 transition-colors leading-none">{num}</span>
    <div>
      <h5 className="text-xl font-bold text-white mb-1">{title}</h5>
      <p className="text-slate-400 leading-relaxed">{text}</p>
    </div>
  </div>
);

const InfoRow = ({ icon, title, text }) => (
  <div className="flex gap-4 items-start">
    <div className="mt-1">{icon}</div>
    <div>
      <div className="text-slate-200 font-bold">{title}</div>
      <div className="text-sm text-slate-400">{text}</div>
    </div>
  </div>
);

export default Home_page;