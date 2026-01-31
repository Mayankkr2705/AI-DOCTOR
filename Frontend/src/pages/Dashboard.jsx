import { Link } from 'react-router-dom';
import { Bot, FileBarChart, Rss, Activity, Sparkles, HeartPulse } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  const features = [
    {
      title: 'AI Chatbot',
      description: 'Chat with specialized medical AI assistants',
      icon: Bot,
      link: '/chatbot',
      gradient: 'bg-gradient-to-br from-violet-500 to-purple-600'
    },
    {
      title: 'Medical Reports',
      description: 'Upload and analyze your medical reports',
      icon: FileBarChart,
      link: '/reports',
      gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600'
    },
    {
      title: 'Health News',
      description: 'Stay updated with latest medical news',
      icon: Rss,
      link: '/news',
      gradient: 'bg-gradient-to-br from-amber-500 to-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-white/90">
            Your personal healthcare dashboard. Access all your medical tools and information in one place.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-violet-100 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Conversations</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">0</p>
              </div>
              <div className="bg-gradient-to-br from-violet-100 to-purple-100 p-3 rounded-xl">
                <Bot className="h-8 w-8 text-violet-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-emerald-100 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Reports Uploaded</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">0</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-100 to-teal-100 p-3 rounded-xl">
                <FileBarChart className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-rose-100 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Health Score</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">--</p>
              </div>
              <div className="bg-gradient-to-br from-rose-100 to-pink-100 p-3 rounded-xl">
                <HeartPulse className="h-8 w-8 text-rose-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-amber-500" />
          Quick Access
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.link}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition transform hover:-translate-y-1 border border-gray-100"
            >
              <div className={`${feature.gradient} w-16 h-16 rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-gradient-to-r from-cyan-50 to-teal-50 border-l-4 border-teal-500 p-6 rounded-r-2xl">
          <h3 className="text-lg font-semibold text-teal-900 mb-2 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-teal-600" />
            Pro Tip
          </h3>
          <p className="text-teal-800">
            Start a conversation with our AI chatbot to get personalized health guidance. 
            Choose from specialized modes: Pediatric, Adult, Women's Health, or Veterinary care.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 p-6 rounded-r-2xl">
          <h3 className="text-lg font-semibold text-amber-900 mb-2">
            ⚠️ Important Disclaimer
          </h3>
          <p className="text-amber-800">
            This AI assistant provides general health information for educational purposes only. 
            It is not a substitute for professional medical advice, diagnosis, or treatment. 
            Always seek the advice of your physician or other qualified health provider with any 
            questions you may have regarding a medical condition.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
