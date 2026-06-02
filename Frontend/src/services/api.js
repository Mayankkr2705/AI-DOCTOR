import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Chatbot API
export const chatAPI = {
  sendMessage: async (message, mode, conversationId = null) => {
    const response = await axios.post(`${API_URL}/chatbot/chat`, {
      message,
      mode,
      conversationId
    });
    return response.data;
  },

  getHistory: async (conversationId = null) => {
    const url = conversationId 
      ? `${API_URL}/chatbot/history/${conversationId}`
      : `${API_URL}/chatbot/history`;
    const response = await axios.get(url);
    return response.data;
  },

  deleteConversation: async (conversationId) => {
    const response = await axios.delete(`${API_URL}/chatbot/history/${conversationId}`);
    return response.data;
  },

  analyzeHealthScore: async (assessmentData) => {
    const response = await axios.post(`${API_URL}/chatbot/health-score`, assessmentData);
    return response.data;
  }
};

// Reports API
export const reportsAPI = {
  uploadReport: async (payload) => {
    const response = await axios.post(`${API_URL}/reports/upload`, payload);
    return response.data;
  },

  analyzeReport: async (reportId) => {
    const response = await axios.post(`${API_URL}/reports/${reportId}/analyze`);
    return response.data;
  },

  getReports: async (status = null) => {
    const url = status ? `${API_URL}/reports?status=${status}` : `${API_URL}/reports`;
    const response = await axios.get(url);
    return response.data;
  },

  getReport: async (reportId) => {
    const response = await axios.get(`${API_URL}/reports/${reportId}`);
    return response.data;
  },

  deleteReport: async (reportId) => {
    const response = await axios.delete(`${API_URL}/reports/${reportId}`);
    return response.data;
  }
};

// News API
export const newsAPI = {
  getNews: async (page = 1, pageSize = 20) => {
    const response = await axios.get(`${API_URL}/news`, {
      params: { page, pageSize }
    });
    return response.data;
  },

  searchNews: async (query, page = 1) => {
    const response = await axios.get(`${API_URL}/news/search`, {
      params: { query, page }
    });
    return response.data;
  }
};

// Medication API
export const medicationAPI = {
  getMedications: async () => {
    const response = await axios.get(`${API_URL}/medications`);
    return response.data;
  },
  addMedication: async (data) => {
    const response = await axios.post(`${API_URL}/medications`, data);
    return response.data;
  },
  updateMedication: async (id, data) => {
    const response = await axios.put(`${API_URL}/medications/${id}`, data);
    return response.data;
  },
  deleteMedication: async (id) => {
    const response = await axios.delete(`${API_URL}/medications/${id}`);
    return response.data;
  },
  toggleActive: async (id) => {
    const response = await axios.patch(`${API_URL}/medications/${id}/toggle`);
    return response.data;
  },
  takeDose: async (id) => {
    const response = await axios.post(`${API_URL}/medications/${id}/take-dose`);
    return response.data;
  }
};

// Auth API
export const authAPI = {
  login: async(email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password
    });
    return response.data;
  },
  register:async(name, email, password) => {
    const response = await axios.post(`${API_URL}/auth/register`, {
      name,
      email,
      password
    })
    return response.data;
  },
  getcurr:async()=>{
    const response = await axios.get(`${API_URL}/auth/me`);
    return response.data;
  },
  googleLogin: async (token) => {
    const response = await axios.post(`${API_URL}/auth/google`, { token });
    return response.data;
  },
  updateProfile: async (name, email, password) => {
    const response = await axios.put(`${API_URL}/auth/me`,{
      name,
      email,
      password
    });
    return response.data;
  },
  deleteProfile: async () => {
    const response = await axios.delete(`${API_URL}/auth/me`);
    return response.data;
  }
}

