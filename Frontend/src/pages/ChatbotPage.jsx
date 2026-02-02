import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader } from 'lucide-react';
import { chatAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MODES = [
  { id: 'child', name: 'Pediatric Care', emoji: '👶', color: 'bg-blue-500' },
  { id: 'adult', name: 'Adult Healthcare', emoji: '👨‍⚕️', color: 'bg-green-500' },
  { id: 'female', name: "Women's Health", emoji: '👩‍⚕️', color: 'bg-pink-500' },
  { id: 'animal', name: 'Veterinary Care', emoji: '🐾', color: 'bg-orange-500' }
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mode Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Select Consultation Mode</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`p-4 rounded-lg border-2 transition ${
                  mode === m.id
                    ? `${m.color} text-white border-transparent`
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-3xl mb-2">{m.emoji}</div>
                <div className="font-semibold text-sm">{m.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-lg shadow-md flex flex-col" style={{ height: '600px' }}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-xl ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' ? 'bg-blue-600' : 'bg-gray-300'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="h-5 w-5 text-white" />
                    ) : (
                      <Bot className="h-5 w-5 text-gray-700" />
                    )}
                  </div>
                  <div className={`rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-gray-700" />
                  </div>
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <Loader className="h-5 w-5 animate-spin text-gray-600" />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows="2"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-blue-600 text-white px-6 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
          <p className="text-sm text-yellow-800">
            <strong>⚠️ Medical Disclaimer:</strong> This AI chatbot provides general health information only. 
            It is not a substitute for professional medical advice, diagnosis, or treatment. 
            Always consult with qualified healthcare professionals for medical concerns.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
