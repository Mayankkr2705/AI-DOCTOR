const { GoogleGenerativeAI } = require('@google/generative-ai');
const ChatHistory = require('../models/ChatHistory');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

    // Generate AI response
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // Build conversation context
    const conversationContext = chatHistory.messages
      .slice(-5) // Last 5 messages for context
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    const prompt = `${modePrompts[mode]}

${conversationContext}

Please provide a helpful, accurate response to the latest user message. Keep responses concise but informative.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

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
