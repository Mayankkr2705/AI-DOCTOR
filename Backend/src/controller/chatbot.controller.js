import axios from 'axios';
import ChatHistory from '../models/ChatHistory.js';

// Groq API configuration
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const clampScore = (value) => {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return 0;
  return Math.max(0, Math.min(100, Math.round(numeric)));
};

const getScoreCategory = (score) => {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 55) return 'Fair';
  return 'Needs Attention';
};

const calculateFallbackHealthScore = (formValues) => {
  let score = 50;

  const sleepHours = Number(formValues.sleepHours || 0);
  const exerciseDays = Number(formValues.exerciseDays || 0);
  const waterLiters = Number(formValues.waterLiters || 0);
  const stressLevel = Number(formValues.stressLevel || 0);
  const fruitsVegDays = Number(formValues.fruitsVegDays || 0);
  const age = Number(formValues.age || 0);

  if (sleepHours >= 7 && sleepHours <= 8) score += 12;
  else if (sleepHours >= 6 && sleepHours <= 9) score += 8;
  else score += 3;

  score += Math.min(exerciseDays, 7) * 3;

  if (waterLiters >= 2) score += 10;
  else if (waterLiters >= 1.5) score += 6;
  else score += 2;

  score += Math.min(fruitsVegDays, 7) * 2;
  score += Math.max(0, 12 - stressLevel * 2);

  if (formValues.smoking === 'yes') score -= 15;
  if (formValues.alcohol === 'yes') score -= 8;
  if (formValues.chronicCondition === 'yes') score -= 10;

  if (age > 60) score -= 4;
  else if (age >= 45) score -= 2;

  const finalScore = clampScore(score);

  return {
    score: finalScore,
    category: getScoreCategory(finalScore),
    summary: 'Estimated score generated using local health rules.',
    recommendations: [
      'Maintain regular exercise and balanced nutrition.',
      'Sleep 7–8 hours and manage stress daily.',
      'Consult a healthcare professional for personalized advice.'
    ]
  };
};

const parseGroqJson = (content) => {
  if (!content) return null;

  try {
    return JSON.parse(content);
  } catch (error) {
    const cleaned = content
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    try {
      return JSON.parse(cleaned);
    } catch (innerError) {
      return null;
    }
  }
};

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

const analyzeHealthScore = async (req, res) => {
  try {
    const {
      age,
      sleepHours,
      exerciseDays,
      waterLiters,
      stressLevel,
      smoking,
      alcohol,
      fruitsVegDays,
      chronicCondition
    } = req.body;

    if (!age) {
      return res.status(400).json({ error: 'Age is required' });
    }

    const formData = {
      age,
      sleepHours,
      exerciseDays,
      waterLiters,
      stressLevel,
      smoking,
      alcohol,
      fruitsVegDays,
      chronicCondition
    };

    const fallback = calculateFallbackHealthScore(formData);

    if (!GROQ_API_KEY) {
      return res.json({ ...fallback, source: 'fallback' });
    }

    try {
      const prompt = `Analyze this health self-assessment and return a JSON object only with keys:
score (number 0-100), category (Excellent|Good|Fair|Needs Attention), summary (string), recommendations (array of 3 short strings).

Input:
${JSON.stringify(formData, null, 2)}

Important:
- This is not a diagnosis.
- Be conservative and practical.
- No markdown, no extra text, JSON only.`;

      const groqResponse = await axios.post(
        GROQ_API_URL,
        {
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are a preventive health assistant. Return strict JSON only.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.2,
          max_tokens: 512
        },
        {
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const content = groqResponse?.data?.choices?.[0]?.message?.content;
      const parsed = parseGroqJson(content);

      if (!parsed) {
        return res.json({ ...fallback, source: 'fallback' });
      }

      const score = clampScore(parsed.score);
      const category = parsed.category || getScoreCategory(score);
      const summary = parsed.summary || fallback.summary;
      const recommendations = Array.isArray(parsed.recommendations) && parsed.recommendations.length > 0
        ? parsed.recommendations.slice(0, 3)
        : fallback.recommendations;

      return res.json({
        score,
        category,
        summary,
        recommendations,
        source: 'groq'
      });
    } catch (apiError) {
      console.error('Groq Health Score Error:', apiError.response?.data || apiError.message);
      return res.json({ ...fallback, source: 'fallback' });
    }
  } catch (error) {
    console.error('Health score analysis error:', error);
    return res.status(500).json({ error: 'Failed to analyze health score', details: error.message });
  }
};

export{
  chat,
  getHistory,
  deleteConversation,
  analyzeHealthScore
};
