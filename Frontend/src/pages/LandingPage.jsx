import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Stethoscope, Bot, ClipboardList, Rss, Lock, Heart, 
  Baby, UserRound, Sparkles, PawPrint, ArrowRight,
  ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck,
  MessageSquare, FileText, Send, Activity
} from 'lucide-react';

const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  const features = [
    {
      title: "AI Consultation",
      badge: "Interactive Chatbot",
      description: "Connect instantly with specialized medical AI bots designed for different age groups and needs. Get immediate answers about pediatric care, adult health, women's wellness, and veterinary concerns.",
      icon: Bot,
      color: "teal-600",
      shadow: "shadow-teal-900/10",
      link: "/chatbot",
      cta: "Consult AI Doctor",
      previewType: "chat"
    },
    {
      title: "Smart Analysis",
      badge: "Lab & Scan Analyzer",
      description: "Upload scans, medical PDFs, and laboratory reports to generate structured, human-readable insights. Our advanced AI scans and decodes complex medical terminology in seconds.",
      icon: ClipboardList,
      color: "teal-600",
      shadow: "shadow-teal-900/10",
      link: "/reports",
      cta: "Analyze Reports",
      previewType: "analysis"
    },
    {
      title: "Health Feed",
      badge: "Verified News & Bulletins",
      description: "Stay updated with verified health bulletins, wellness discoveries, and medical breakthroughs. Read curated summaries of medical journals and clinical updates vetted for clarity and accuracy.",
      icon: Rss,
      color: "teal-600",
      shadow: "shadow-teal-900/10",
      link: "/news",
      cta: "View Health Feed",
      previewType: "feed"
    },
    {
      title: "Privacy Lock",
      badge: "Enterprise-Grade Security",
      description: "Your health data belongs to you. Every medical file uploaded, consultation transcript, and profile metric is fully encrypted end-to-end and strictly secured against unauthorized access.",
      icon: Lock,
      color: "teal-600",
      shadow: "shadow-teal-900/10",
      link: "/dashboard",
      cta: "Secure Dashboard",
      previewType: "privacy"
    }
  ];

  useEffect(() => {
    if (!isAutoplay) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isAutoplay]);

  const renderPreview = (type) => {
    switch (type) {
      case 'chat':
        return (
          <div className="w-full max-w-sm mx-auto bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-800 text-slate-100 flex flex-col h-[280px]">
            {/* Header */}
            <div className="px-4 py-3 bg-slate-800/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center border border-teal-500/30">
                  <Bot className="h-4 w-4 text-teal-400" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-semibold leading-none">Pediatric AI Doctor</h4>
                  <span className="text-[10px] text-teal-400 flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" /> Active Assistant
                  </span>
                </div>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-350 px-2 py-0.5 rounded-full border border-slate-700">Specialist Mode</span>
            </div>
            {/* Messages */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto text-xs">
              <div className="flex justify-end">
                <div className="bg-teal-600/90 text-white rounded-2xl rounded-tr-none px-3.5 py-2 max-w-[80%] shadow-sm text-left">
                  What are the common symptoms of a mild pediatric fever?
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 rounded-full bg-slate-850 flex items-center justify-center flex-shrink-0 border border-slate-700">
                  <Bot className="h-3 w-3 text-teal-400" />
                </div>
                <div className="bg-slate-800 text-slate-200 rounded-2xl rounded-tl-none px-3.5 py-2 max-w-[80%] shadow-sm leading-relaxed text-left">
                  Common signs include body temperatures above 100.4°F, irritability, and slight sleepiness. Keep them hydrated and consult a physician if...
                </div>
              </div>
            </div>
            {/* Input Bar */}
            <div className="p-3 bg-slate-800/80 border-t border-slate-800 flex gap-2 items-center">
              <div className="flex-1 bg-slate-800/85 rounded-xl px-3 py-1.5 border border-slate-700 text-slate-400 text-[11px] flex justify-between items-center">
                <span>Ask about child health...</span>
                <Send className="h-3.5 w-3.5 text-slate-500" />
              </div>
            </div>
          </div>
        );
      case 'analysis':
        return (
          <div className="w-full max-w-sm mx-auto bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-800 text-slate-100 p-5 h-[280px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">Lab OCR V2</span>
                <span className="text-xs text-slate-400">PDF Document</span>
              </div>
              
              {/* Document Icon & Title */}
              <div className="flex items-center gap-3 p-3 bg-slate-800/60 rounded-xl border border-slate-700 mb-4 text-left">
                <div className="bg-teal-500/20 p-2 rounded-lg border border-teal-500/30">
                  <FileText className="h-5 w-5 text-teal-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-200 truncate">Blood_Report_May2026.pdf</p>
                  <p className="text-[10px] text-slate-400">142 KB • Scan uploaded successfully</p>
                </div>
                <CheckCircle2 className="h-4 w-4 text-teal-400 flex-shrink-0" />
              </div>

              {/* Extraction Metrics */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center bg-slate-800/40 p-2 rounded-lg border border-slate-750">
                  <span className="text-slate-400">Hemoglobin Count</span>
                  <span className="text-teal-400 font-medium">14.2 g/dL (Normal)</span>
                </div>
                <div className="flex justify-between items-center bg-slate-800/40 p-2 rounded-lg border border-slate-750">
                  <span className="text-slate-400">Vitamin D (25-OH)</span>
                  <span className="text-teal-500 font-medium">21 ng/mL (Vetted)</span>
                </div>
              </div>
            </div>
            
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-450">
              <span className="flex items-center gap-1"><Activity className="h-3 w-3 text-teal-400" /> Medical summary compiled</span>
              <span className="text-teal-400 font-semibold">Ready</span>
            </div>
          </div>
        );
      case 'feed':
        return (
          <div className="w-full max-w-sm mx-auto bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-800 text-slate-100 p-4 h-[280px] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                <Rss className="h-3.5 w-3.5" /> Latest Wellness Bulletins
              </h4>
              <span className="text-[10px] bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded-full">Updated Live</span>
            </div>
            
            {/* Feed Cards */}
            <div className="space-y-3 flex-1 overflow-y-auto">
              <div className="bg-slate-800/40 hover:bg-slate-800/60 transition p-2.5 rounded-xl border border-slate-750/50 text-left">
                <div className="flex items-center justify-between text-[9px] text-slate-400 mb-1">
                  <span className="font-semibold text-teal-400">Cardiology</span>
                  <span>2 hours ago</span>
                </div>
                <h5 className="text-[11px] font-bold text-slate-200 line-clamp-1">Study links morning walks with lower arterial stiffness</h5>
                <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                  Research on 1,200 adults confirms that regular moderate physical activity significantly boosts cardiovascular elasticity...
                </p>
              </div>

              <div className="bg-slate-800/40 hover:bg-slate-800/60 transition p-2.5 rounded-xl border border-slate-750/50 text-left">
                <div className="flex items-center justify-between text-[9px] text-slate-400 mb-1">
                  <span className="font-semibold text-teal-400">Nutrition</span>
                  <span>1 day ago</span>
                </div>
                <h5 className="text-[11px] font-bold text-slate-200 line-clamp-1">Optimizing sleep cycles through magnesium intake</h5>
                <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                  Clinical trials show magnesium glycinate improves natural melatonin secretion, resulting in 20% deeper REM states...
                </p>
              </div>
            </div>
          </div>
        );
      case 'privacy':
        return (
          <div className="w-full max-w-sm mx-auto bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-800 text-slate-100 p-5 h-[280px] flex flex-col justify-between items-center text-center">
            {/* Glow effect surrounding shield */}
            <div className="relative mt-2">
              <div className="absolute inset-0 bg-teal-500/20 rounded-full blur-xl animate-pulse" />
              <div className="relative bg-teal-600 p-4 rounded-full shadow-lg shadow-teal-500/30">
                <ShieldCheck className="h-10 w-10 text-white" />
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-bold text-slate-200 mb-1">Encrypted Secure Tunnel</h4>
              <p className="text-[11px] text-slate-400 max-w-[85%] mx-auto leading-relaxed">
                All patient profiles, document uploads, and chatbot consultation histories are shielded by strict protocols.
              </p>
            </div>

            <div className="w-full grid grid-cols-2 gap-2 text-[10px] pt-3 border-t border-slate-800">
              <div className="bg-slate-800/80 p-1.5 rounded-lg border border-slate-750 flex items-center justify-center gap-1 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                <span>AES-256 Bit</span>
              </div>
              <div className="bg-slate-800/80 p-1.5 rounded-lg border border-slate-750 flex items-center justify-center gap-1 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                <span>HIPAA Vetted</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans">
      {/* Decorative Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-400/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-cyan-400/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Top Badge */}
            <div className="inline-flex items-center space-x-2 bg-teal-500/10 border border-teal-500/20 text-teal-700 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-6 animate-fade-in">
              <Sparkles className="h-4 w-4 text-teal-600 animate-pulse" />
              <span>Next-Gen Medical Assistance Powered by AI</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.15]">
              Your Smart AI-Powered{' '}
              <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                Healthcare Companion
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Experience instant medical consultation and deep report analysis with our specialized AI doctors, customized for pediatric, adult, women's health, and veterinary care.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/signup"
                className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white px-8 py-4 rounded-2xl font-bold text-base sm:text-lg transition shadow-lg shadow-teal-900/20 hover:shadow-teal-900/30 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/chatbot"
                className="bg-white/80 backdrop-blur-md border border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold text-base sm:text-lg hover:bg-slate-50 transition shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
              >
                <Bot className="h-5 w-5 text-teal-600" />
                <span>Try AI Chatbot</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Comprehensive Medical Features
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Empowering your health choices through highly accurate AI assistance and modern clinical insights.
            </p>
          </div>

          {/* Interactive Slideshow */}
          <div 
            className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/40 backdrop-blur-md shadow-2xl transition-all duration-300"
            onMouseEnter={() => setIsAutoplay(false)}
            onMouseLeave={() => setIsAutoplay(true)}
          >
            {/* Sliding Track */}
            <div 
              className="flex transition-transform duration-700 ease-out" 
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {features.map((feature, idx) => {
                const IconComponent = feature.icon;
                return (
                  <div key={idx} className="w-full flex-shrink-0 grid md:grid-cols-12 gap-8 px-14 py-8 md:px-24 md:py-12 items-center">
                    
                    {/* Left Pane: Details */}
                    <div className="md:col-span-7 flex flex-col justify-center text-left md:pr-4 ">
                      <div className="inline-flex items-center space-x-2 bg-slate-100 text-slate-750 px-3 py-1 rounded-full text-xs font-semibold mb-4 w-fit border border-slate-200">
                        <span className={`w-2 h-2 rounded-full bg-${feature.color}`} />
                        <span>{feature.badge}</span>
                      </div>
                      
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4 flex items-center gap-2.5">
                        <span className={`bg-${feature.color} p-2 rounded-xl text-white shadow-md ${feature.shadow}`}>
                          <IconComponent className="h-5 w-5" />
                        </span>
                        {feature.title}
                      </h3>
                      
                      <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                        {feature.description}
                      </p>
                      
                      <Link
                        to={feature.link}
                        className={`inline-flex items-center justify-center space-x-2 w-fit bg-${feature.color} hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-bold text-sm sm:text-base transition shadow-md ${feature.shadow} hover:shadow-lg`}
                      >
                        <span>{feature.cta}</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>

                    {/* Right Pane: Premium Interactive Mock Preview */}
                    <div className="md:col-span-5 flex items-center justify-center relative py-4">
                      {/* Decorative backdrop glow for preview */}
                      <div className={`absolute -inset-2 bg-${feature.color} opacity-[0.04] blur-2xl rounded-full`} />
                      
                      <div className="relative z-10 w-full">
                        {renderPreview(feature.previewType)}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Slider Controls (Left/Right Arrows) - Hidden on extra small viewports */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev === 0 ? features.length - 1 : prev - 1))}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-750 hover:text-slate-950 p-2 md:p-2.5 rounded-full border border-slate-200 shadow-md transition hover:scale-105 active:scale-95 z-20"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % features.length)}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-750 hover:text-slate-950 p-2 md:p-2.5 rounded-full border border-slate-200 shadow-md transition hover:scale-105 active:scale-95 z-20"
              aria-label="Next Slide"
            >
              <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
            </button>
          </div>

          {/* Dots Indicator / Nav Timeline */}
          <div className="flex justify-center items-center space-x-3 mt-8">
            {features.map((feature, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-300 rounded-full h-2 ${
                  currentSlide === idx 
                    ? 'w-8 bg-slate-800' 
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* Specializations Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Specialized Medical AI Profiles
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Get clinical recommendations curated by specialized AI modules.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Card 1 */}
            <div className="group bg-slate-50 hover:bg-gradient-to-br hover:from-sky-50 hover:to-blue-50/50 p-8 rounded-3xl border border-slate-100 hover:border-sky-500/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-br from-sky-500 to-blue-600 p-3 rounded-2xl shadow-md shadow-sky-500/10 group-hover:scale-105 transition-transform mr-4">
                    <Baby className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Pediatric Mode</h3>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  Targeted guidance for infants and adolescent health. Get advice on child vaccinations, pediatric fever, allergies, and physical development milestones.
                </p>
              </div>
              <Link to="/chatbot" className="text-sky-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                <span>Open Pediatric Chat</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Card 2 */}
            <div className="group bg-slate-50 hover:bg-gradient-to-br hover:from-teal-50 hover:to-emerald-50/50 p-8 rounded-3xl border border-slate-100 hover:border-teal-500/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-3 rounded-2xl shadow-md shadow-teal-500/10 group-hover:scale-105 transition-transform mr-4">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Adult Healthcare</h3>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  Assistance with general adult diagnoses. Get support with chronic disease care, physical fitness guidelines, dietary reviews, and common health symptoms.
                </p>
              </div>
              <Link to="/chatbot" className="text-teal-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                <span>Open Adult Chat</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Card 3 */}
            <div className="group bg-slate-50 hover:bg-gradient-to-br hover:from-pink-50 hover:to-rose-50/50 p-8 rounded-3xl border border-slate-100 hover:border-pink-500/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-3 rounded-2xl shadow-md shadow-pink-500/10 group-hover:scale-105 transition-transform mr-4">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Women's Health</h3>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  Tailored guidance for women's reproductive health, prenatal/postnatal queries, hormonal balances, and overall female wellness information.
                </p>
              </div>
              <Link to="/chatbot" className="text-pink-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                <span>Open Women's Chat</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Card 4 */}
            <div className="group bg-slate-50 hover:bg-gradient-to-br hover:from-amber-50 hover:to-orange-50/50 p-8 rounded-3xl border border-slate-100 hover:border-amber-500/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-2xl shadow-md shadow-amber-500/10 group-hover:scale-105 transition-transform mr-4">
                    <PawPrint className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Veterinary Care</h3>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  Specialized pet health advice for dogs, cats, and common livestock. Get diagnostics on pet nutrition, vaccinations, and pet behavioral care.
                </p>
              </div>
              <Link to="/chatbot" className="text-amber-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                <span>Open Veterinary Chat</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[40%] h-[100%] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 tracking-tight">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-slate-350 text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Create an account to gain full access to private AI consultations, report insights, and custom health scoring.
          </p>
          <Link
            to="/chatbot"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white px-8 py-4 rounded-2xl font-bold text-base sm:text-lg transition shadow-lg shadow-teal-500/20"
          >
            <Bot className="h-5 w-5" />
            <span>Start Chatting Now</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
