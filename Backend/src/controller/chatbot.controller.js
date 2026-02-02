const axios = require('axios');
const ChatHistory = require('../models/ChatHistory');

// Groq API configuration
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Mode-specific system prompts
const modePrompts = {
  child: `You are a pediatrician (child doctor) AI assistant. You specialize in children's health, 
          from newborns to teenagers. Provide medical information in a caring, reassuring tone. 
          Focus on common childhood illnesses, vaccinations, growth milestones, and pediatric care. 
          Always recommend consulting a real pediatrician for serious concerns.`,

  adult: `You are a general physician AI assistant specializing in adult healthcare. 
          Provide medical information for adults covering general health, chronic conditions, 
          preventive care, and lifestyle management. Use professional but accessible language. 
          Always recommend consulting a healthcare provider for diagnosis and treatment.`,

  female: `You are a women's health specialist AI assistant. Focus on women's health issues 
          including reproductive health, pregnancy, menstrual health, menopause, and gender-specific 
          medical concerns. Provide empathetic, accurate information while maintaining professional boundaries. 
          Always recommend consulting a healthcare provider for personal medical advice.`,

  animal: `You are a veterinary AI assistant. Provide information about animal health, 
      covering various pets and animals. Discuss symptoms, common conditions, preventive care, 
      nutrition, and general animal wellness. Always recommend consulting a licensed veterinarian 
      for diagnosis and treatment of animals.`
};

// Mock response generator when API is unavailable


const chat = async (req, res) => {
  try {
    const { message, mode = 'adult', conversationId } = req.body;
    const userId = req.user._id;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!['child', 'adult', 'female', 'animal'].includes(mode)) {
      return res.status(400).json({ error: 'Invalid mode' });
    }

    // Get or create chat history
    let chatHistory;
    if (conversationId) {
      chatHistory = await ChatHistory.findOne({ _id: conversationId, userId });
      if (!chatHistory) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
    } else {
      chatHistory = new ChatHistory({
        userId,
        mode,
        messages: []
      });
    }

    // Add user message
    chatHistory.messages.push({
      role: 'user',
      content: message
    });

    let response;

    // Try Groq API, fallback to mock response if unavailable
    if (GROQ_API_KEY) {
      try {
        const conversationMessages = chatHistory.messages
          .slice(-5)
          .map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
          }));

        const groqResponse = await axios.post(
          GROQ_API_URL,
          {
            model: 'llama-3.3-70b-versatile',
            messages: [
              {
                role: 'system',
                content: modePrompts[mode] + '\n\nPlease provide a helpful, accurate response. Keep responses concise but informative.'
              },
              ...conversationMessages
            ],
            temperature: 0.7,
            max_tokens: 1024
          },
          {
            headers: {
              'Authorization': `Bearer ${GROQ_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );

        response = groqResponse.data.choices[0].message.content;
      } catch (apiError) {
        console.error('Groq API Error:', apiError.response?.data || apiError.message);
        
      }
    } else {
      // No API key, use mock response
      console.log("No api key");
      
    }

    // Add assistant message
    chatHistory.messages.push({
      role: 'assistant',
      content: response
    });

    chatHistory.updatedAt = Date.now();
    await chatHistory.save();

    res.json({
      message: response,
      conversationId: chatHistory._id,
      mode: chatHistory.mode
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ error: 'Failed to generate response', details: error.message });
  }
};

// Get chat history
const getHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { conversationId } = req.params;

    if (conversationId) {
      const chatHistory = await ChatHistory.findOne({ _id: conversationId, userId });
      if (!chatHistory) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
      return res.json(chatHistory);
    }

    const conversations = await ChatHistory.find({ userId })
      .sort({ updatedAt: -1 })
      .select('mode createdAt updatedAt messages')
      .limit(20);

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteConversation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { conversationId } = req.params;

    const result = await ChatHistory.deleteOne({ _id: conversationId, userId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  chat,
  getHistory,
  deleteConversation
};
