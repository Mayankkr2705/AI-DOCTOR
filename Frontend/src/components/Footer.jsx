import { Stethoscope, Mail, Phone, MapPin, Heart, Bot, FileBarChart, Rss } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-lg">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">MediCare AI</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your intelligent healthcare companion, providing AI-powered medical assistance and information.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <a href="/" className="hover:text-emerald-400 transition flex items-center gap-2">
                  <Heart className="h-4 w-4" /> Home
                </a>
              </li>
              <li>
                <a href="/chatbot" className="hover:text-emerald-400 transition flex items-center gap-2">
                  <Bot className="h-4 w-4" /> AI Chatbot
                </a>
              </li>
              <li>
                <a href="/reports" className="hover:text-emerald-400 transition flex items-center gap-2">
                  <FileBarChart className="h-4 w-4" /> Reports
                </a>
              </li>
              <li>
                <a href="/news" className="hover:text-emerald-400 transition flex items-center gap-2">
                  <Rss className="h-4 w-4" /> Health News
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Services</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-sky-400 rounded-full"></span>
                Pediatric Care
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-teal-400 rounded-full"></span>
                Adult Healthcare
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                Women's Health
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                Veterinary Care
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-center space-x-2 hover:text-emerald-400 transition">
                <Mail className="h-4 w-4 text-emerald-500" />
                <span>contact@medicareai.com</span>
              </li>
              <li className="flex items-center space-x-2 hover:text-emerald-400 transition">
                <Phone className="h-4 w-4 text-teal-500" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2 hover:text-emerald-400 transition">
                <MapPin className="h-4 w-4 text-cyan-500" />
                <span>123 Health St, Medical City</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} MediCare AI. All rights reserved.</p>
          <p className="mt-2">
            <span className="text-amber-400">⚠️ Disclaimer:</span> This is an AI assistant for informational purposes only. 
            Always consult with qualified healthcare professionals for medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
