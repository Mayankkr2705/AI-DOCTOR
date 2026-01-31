import { Link } from 'react-router-dom';
import { 
  Stethoscope, Bot, ClipboardList, Rss, Lock, Heart, 
  Baby, UserRound, Sparkles, PawPrint, ArrowRight 
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                <Stethoscope className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Your AI-Powered Healthcare Companion
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-3xl mx-auto">
              Get instant medical insights with our intelligent chatbot specialized in 
              pediatric, adult, women's health, and veterinary care
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/dashboard"
                className="bg-white text-teal-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-teal-50 transition shadow-lg flex items-center justify-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/chatbot"
                className="bg-white/20 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/30 transition flex items-center justify-center space-x-2"
              >
                <Bot className="h-5 w-5" />
                <span>Try AI Chatbot</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
            Comprehensive Healthcare Solutions
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Everything you need for your health journey, powered by advanced AI technology
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl hover:shadow-xl transition border border-violet-100">
              <div className="bg-gradient-to-br from-violet-500 to-purple-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Bot className="text-white h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">AI Chatbot</h3>
              <p className="text-gray-600">
                Chat with our specialized AI doctors for personalized health guidance
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl hover:shadow-xl transition border border-emerald-100">
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <ClipboardList className="text-white h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Report Analysis</h3>
              <p className="text-gray-600">
                Upload medical reports for AI-powered analysis and insights
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl hover:shadow-xl transition border border-amber-100">
              <div className="bg-gradient-to-br from-amber-500 to-orange-500 w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Rss className="text-white h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Health News</h3>
              <p className="text-gray-600">
                Stay updated with the latest medical research and health news
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl hover:shadow-xl transition border border-rose-100">
              <div className="bg-gradient-to-br from-rose-500 to-pink-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Lock className="text-white h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Secure & Private</h3>
              <p className="text-gray-600">
                Your health data is encrypted and completely confidential
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Specializations Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
            Specialized Medical Expertise
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Choose from our specialized AI modes tailored to different healthcare needs
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-sky-50 to-blue-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition border border-sky-100">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-br from-sky-500 to-blue-600 p-3 rounded-xl mr-4">
                  <Baby className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">Pediatric Care</h3>
              </div>
              <p className="text-gray-600">
                Specialized guidance for children's health, from newborns to teenagers. 
                Get advice on common childhood illnesses, vaccinations, and development milestones.
              </p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition border border-teal-100">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-3 rounded-xl mr-4">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">Adult Healthcare</h3>
              </div>
              <p className="text-gray-600">
                Comprehensive health information for adults covering chronic conditions, 
                preventive care, lifestyle management, and general wellness.
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition border border-pink-100">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-3 rounded-xl mr-4">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">Women's Health</h3>
              </div>
              <p className="text-gray-600">
                Dedicated support for women's health issues including reproductive health, 
                pregnancy, menstrual health, and menopause guidance.
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition border border-amber-100">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-xl mr-4">
                  <PawPrint className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">Veterinary Care</h3>
              </div>
              <p className="text-gray-600">
                Expert advice for your pets and animals. Get information about animal health, 
                common conditions, nutrition, and preventive care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-teal-600 via-emerald-600 to-cyan-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of users who trust MediCare AI for their healthcare needs
          </p>
          <Link
            to="/chatbot"
            className="inline-flex items-center space-x-2 bg-white text-teal-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-teal-50 transition shadow-lg"
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
