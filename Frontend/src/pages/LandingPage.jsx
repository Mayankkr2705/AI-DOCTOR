import { Link } from 'react-router-dom';
import { 
  Stethoscope, Bot, ClipboardList, Rss, Lock, Heart, 
  Baby, UserRound, Sparkles, PawPrint, ArrowRight 
} from 'lucide-react';

const LandingPage = () => {
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

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="group p-6 bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-3xl hover:bg-white hover:shadow-xl hover:shadow-slate-100 hover:border-violet-500/20 transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-gradient-to-br from-violet-500 to-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-5 shadow-md shadow-purple-500/10 group-hover:scale-110 transition-transform">
                <Bot className="text-white h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">AI Consultation</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Connect instantly with customized medical bots designed for different age groups and needs.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group p-6 bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-3xl hover:bg-white hover:shadow-xl hover:shadow-slate-100 hover:border-emerald-500/20 transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-5 shadow-md shadow-emerald-500/10 group-hover:scale-110 transition-transform">
                <ClipboardList className="text-white h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Smart Analysis</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Upload scans, PDFs, and laboratory reports to generate structured, human-readable insights.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group p-6 bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-3xl hover:bg-white hover:shadow-xl hover:shadow-slate-100 hover:border-amber-500/20 transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-gradient-to-br from-amber-500 to-orange-500 w-12 h-12 rounded-2xl flex items-center justify-center mb-5 shadow-md shadow-amber-500/10 group-hover:scale-110 transition-transform">
                <Rss className="text-white h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Health Feed</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Stay updated with verified health bulletins, wellness discoveries, and medical breakthroughs.
              </p>
            </div>

            {/* Card 4 */}
            <div className="group p-6 bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-3xl hover:bg-white hover:shadow-xl hover:shadow-slate-100 hover:border-rose-500/20 transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-gradient-to-br from-rose-500 to-pink-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-5 shadow-md shadow-rose-500/10 group-hover:scale-110 transition-transform">
                <Lock className="text-white h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Privacy Lock</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Your medical files and chat histories are completely encrypted and strictly secure.
              </p>
            </div>
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
