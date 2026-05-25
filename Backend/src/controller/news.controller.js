import axios from 'axios';

// Get medical news
export const getNews = async (req, res) => {
  try {
    const { category = 'health', page = 1, pageSize = 20 } = req.query;

    // Using NewsAPI.org 
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
export const searchNews = async (req, res) => {
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



