import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader, Sparkles, AlertCircle, Info } from 'lucide-react';
import { chatAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MODES = [
  { id: 'child', name: 'Pediatric Care', emoji: '👶', color: 'bg-blue-500', text: 'text-blue-500', hover: 'hover:border-blue-500/30' },
  { id: 'adult', name: 'Adult Healthcare', emoji: '👨‍⚕️', color: 'bg-emerald-500', text: 'text-emerald-500', hover: 'hover:border-emerald-500/30' },
  { id: 'female', name: "Women's Health", emoji: '👩‍⚕️', color: 'bg-pink-500', text: 'text-pink-500', hover: 'hover:border-pink-500/30' },
  { id: 'animal', name: 'Veterinary Care', emoji: '🐾', color: 'bg-amber-500', text: 'text-amber-500', hover: 'hover:border-amber-500/30' }
];

// Guest mode responses
const getGuestResponse = (message, mode) => {
  const lowerMessage = message.toLowerCase();
  
  const modeGreetings = {
    child: "As a pediatric health assistant",
    adult: "As a general health assistant",
    female: "As a women's health assistant",
    animal: "As a veterinary health assistant"
  };

  if (lowerMessage.includes('headache') || lowerMessage.includes('head pain')) {
    return `${modeGreetings[mode]}, I can share some general information about headaches.

**Common causes:**
• Stress and tension
• Dehydration
• Lack of sleep
• Eye strain from screens

**General tips:**
• Stay hydrated - drink plenty of water
• Get adequate rest (7-9 hours)
• Take breaks from screens
• Try relaxation techniques

**Seek medical attention if:**
• Severe or sudden headache
• Headache with fever or stiff neck
• Vision changes

⚠️ *This is general information. Please consult a healthcare provider for personalized advice.*`;
  }

  if (lowerMessage.includes('fever') || lowerMessage.includes('temperature')) {
    return `${modeGreetings[mode]}, here's some information about fever.

**What is fever?**
A fever is usually a sign your body is fighting an infection.

**General care:**
• Rest and stay hydrated
• Use light clothing
• Monitor temperature regularly

**When to seek help:**
• Temperature above 103°F (39.4°C)
• Fever lasting more than 3 days
• Accompanied by severe symptoms

⚠️ *Please consult a healthcare provider for proper diagnosis.*`;
  }

  if (lowerMessage.includes('cold') || lowerMessage.includes('cough') || lowerMessage.includes('flu')) {
    return `${modeGreetings[mode]}, here's information about cold and flu symptoms.

**Self-care tips:**
• Get plenty of rest
• Stay hydrated with water, tea, or broth
• Use honey for cough relief (not for children under 1)
• Saline nasal spray for congestion

**See a doctor if:**
• Symptoms worsen after a week
• High fever or difficulty breathing
• Underlying health conditions

⚠️ *This is general information only. Consult a healthcare provider if symptoms persist.*`;
  }

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return `Hello! ${modeGreetings[mode]}, I'm here to help answer your health questions. What would you like to know about today?

You can ask me about:
• Common symptoms and conditions
• General health tips
• When to seek medical care

⚠️ *Remember: I provide general information only, not medical diagnoses.*`;
  }

  return `${modeGreetings[mode]}, thank you for your question about "${message}".

**General Health Tips:**
• Maintain a balanced diet with fruits and vegetables
• Exercise regularly (at least 150 minutes per week)
• Get 7-9 hours of quality sleep
• Stay hydrated throughout the day
• Manage stress through relaxation techniques
• Schedule regular check-ups with healthcare providers

**Important Reminder:**
For specific health concerns, symptoms, or conditions, please consult with a qualified healthcare professional who can provide personalized medical advice.

⚠️ *This is a demo response. For full AI-powered responses, please sign up for an account.*`;
};

const ChatbotPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('adult');
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { isGuest } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length) {
      scrollToBottom();
    }
  }, [messages]);

  // Load guest messages from localStorage
  useEffect(() => {
    if (isGuest) {
      const savedMessages = localStorage.getItem(`guest_chat_${mode}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
        return;
      }
    }
    
    // Reset conversation when mode changes
    setMessages([]);
    setConversationId(null);
    
    // Add welcome message
    const selectedMode = MODES.find(m => m.id === mode);
    setMessages([{
      role: 'assistant',
      content: `Hello! I'm your ${selectedMode.name} assistant ${selectedMode.emoji}. How can I help you today?`
    }]);
    
    // Scroll to top when mode changes
    const chatContainer = document.querySelector('.overflow-y-auto');
    if (chatContainer) {
      chatContainer.scrollTop = 0;
    }
  }, [mode, isGuest]);

  // Save guest messages to localStorage
  useEffect(() => {
    if (isGuest && messages.length > 0) {
      localStorage.setItem(`guest_chat_${mode}`, JSON.stringify(messages));
    }
  }, [messages, mode, isGuest]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    // Guest mode - use local responses
    if (isGuest) {
      setTimeout(() => {
        const response = getGuestResponse(userMessage, mode);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: response 
        }]);
        setLoading(false);
      }, 1000); // Simulate API delay
      return;
    }

    // Authenticated user - use API
    try {
      const response = await chatAPI.sendMessage(userMessage, mode, conversationId);
      
      // Update conversation ID
      if (!conversationId) {
        setConversationId(response.conversationId);
      }

      // Add assistant response
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.message 
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again or check if the backend server is running.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden py-8 font-sans">
      {/* Glow Blur Orbs */}
      <div className="absolute top-[5%] left-[-10%] w-[35%] h-[35%] bg-teal-400/5 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[5%] right-[-10%] w-[35%] h-[35%] bg-violet-400/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Mode Selection Card */}
        <div className="bg-white rounded-3xl shadow-sm p-6 mb-6 border border-slate-200/50">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-1.5">
            <Sparkles className="h-5 w-5 text-teal-500" />
            Select Consultation Profile
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {MODES.map((m) => {
              const isActive = mode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`group p-5 rounded-2xl border-2 text-center transition-all duration-300 transform hover:-translate-y-0.5 ${
                    isActive
                      ? `${m.color} text-white border-transparent shadow-lg shadow-teal-500/10`
                      : `bg-white text-slate-700 border-slate-200 ${m.hover} hover:shadow-md hover:bg-slate-50/50`
                  }`}
                >
                  <div className={`text-4xl mb-2 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>{m.emoji}</div>
                  <div className="font-bold text-xs sm:text-sm tracking-wide">{m.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-3xl shadow-md border border-slate-200/50 flex flex-col overflow-hidden" style={{ height: '620px' }}>
          {/* Header */}
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
                <Bot className="h-5 w-5 text-teal-400" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide">
                  {MODES.find(m => m.id === mode).name} Bot
                </h3>
                <span className="text-[10px] text-teal-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                  AI Clinical Consultation Active
                </span>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
            {messages.map((message, index) => {
              const isUser = message.role === 'user';
              return (
                <div
                  key={index}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div className={`flex items-start space-x-2 max-w-xl ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                      isUser ? 'bg-gradient-to-tr from-teal-600 to-emerald-600' : 'bg-white border border-slate-200'
                    }`}>
                      {isUser ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-slate-700" />
                      )}
                    </div>
                    {/* Bubble */}
                    <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                      isUser
                        ? 'bg-gradient-to-tr from-teal-600 to-emerald-600 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200/50 rounded-tl-none'
                    }`}>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                    <Bot className="h-4 w-4 text-slate-700" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 flex items-center shadow-sm">
                    <Loader className="h-4 w-4 animate-spin text-teal-600" />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-100 p-4 bg-white">
            <div className="flex space-x-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Ask ${MODES.find(m => m.id === mode).name} anything...`}
                className="flex-1 border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 rounded-2xl px-4 py-2.5 text-sm outline-none resize-none bg-slate-50 transition min-h-[46px] max-h-[120px]"
                rows="1"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-gradient-to-tr from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white px-5 rounded-2xl transition-all duration-200 shadow-md shadow-teal-900/10 hover:shadow-teal-950/20 disabled:from-slate-200 disabled:to-slate-250 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer Alert Box */}
        <div className="mt-6 bg-gradient-to-r from-amber-50/50 to-slate-100/10 border-l-4 border-amber-500 p-4 rounded-r-2xl border border-amber-100/50 flex gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>Medical Disclaimer:</strong> This clinical AI chatbot provides general educational references. It does not replace formal diagnoses, physical checks, or healthcare provider prescriptions. Always seek immediate clinical guidance for symptoms or emergency care.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
