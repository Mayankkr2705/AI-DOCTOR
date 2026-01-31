const axios = require('axios');

// Get medical news
const getNews = async (req, res) => {
  try {
    const { category = 'health', page = 1, pageSize = 20 } = req.query;

    // Using NewsAPI.org - you'll need to sign up for a free API key
    const NEWS_API_KEY = process.env.NEWS_API_KEY;
    
    if (!NEWS_API_KEY) {
      // Return mock data if API key is not set
      return res.json({
        articles: getMockNews(),
        totalResults: 10,
        page: 1
      });
    }

    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        category: 'health',
        language: 'en',
        page,
        pageSize,
        apiKey: NEWS_API_KEY
      }
    });

    res.json({
      articles: response.data.articles,
      totalResults: response.data.totalResults,
      page: parseInt(page)
    });
  } catch (error) {
    console.error('News API error:', error.message);
    // Return mock data on error
    res.json({
      articles: getMockNews(),
      totalResults: 10,
      page: 1
    });
  }
};

// Search news
const searchNews = async (req, res) => {
  try {
    const { query, page = 1, pageSize = 20 } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const NEWS_API_KEY = process.env.NEWS_API_KEY;
    
    if (!NEWS_API_KEY) {
      return res.json({
        articles: getMockNews().filter(article => 
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.description.toLowerCase().includes(query.toLowerCase())
        ),
        totalResults: 5,
        page: 1
      });
    }

    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: `${query} health medical`,
        language: 'en',
        sortBy: 'publishedAt',
        page,
        pageSize,
        apiKey: NEWS_API_KEY
      }
    });

    res.json({
      articles: response.data.articles,
      totalResults: response.data.totalResults,
      page: parseInt(page)
    });
  } catch (error) {
    console.error('News search error:', error.message);
    res.json({
      articles: getMockNews(),
      totalResults: 5,
      page: 1
    });
  }
};

// Mock news data
function getMockNews() {
  return [
    {
      title: "New Breakthrough in Cancer Treatment Shows Promise",
      description: "Researchers have discovered a new immunotherapy approach that shows significant promise in treating various types of cancer.",
      url: "#",
      urlToImage: "https://via.placeholder.com/400x250",
      publishedAt: new Date().toISOString(),
      source: { name: "Medical News Today" }
    },
    {
      title: "AI-Powered Diagnosis Tools Improve Accuracy in Medical Imaging",
      description: "Artificial intelligence is revolutionizing medical imaging with new tools that can detect diseases earlier and more accurately.",
      url: "#",
      urlToImage: "https://via.placeholder.com/400x250",
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      source: { name: "Health Tech Journal" }
    },
    {
      title: "Understanding the Importance of Mental Health in Overall Wellness",
      description: "Mental health professionals emphasize the crucial connection between mental and physical health.",
      url: "#",
      urlToImage: "https://via.placeholder.com/400x250",
      publishedAt: new Date(Date.now() - 172800000).toISOString(),
      source: { name: "Psychology Today" }
    },
    {
      title: "New Guidelines for Heart Health Released by Medical Association",
      description: "Updated cardiovascular health guidelines focus on prevention and early intervention strategies.",
      url: "#",
      urlToImage: "https://via.placeholder.com/400x250",
      publishedAt: new Date(Date.now() - 259200000).toISOString(),
      source: { name: "Cardiology News" }
    },
    {
      title: "Advances in Telemedicine Transform Healthcare Access",
      description: "Telemedicine continues to expand, making healthcare more accessible to remote and underserved populations.",
      url: "#",
      urlToImage: "https://via.placeholder.com/400x250",
      publishedAt: new Date(Date.now() - 345600000).toISOString(),
      source: { name: "Healthcare Innovation" }
    }
  ];
}

module.exports = {
  getNews,
  searchNews
};
