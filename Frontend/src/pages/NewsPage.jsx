import { useState, useEffect } from 'react';
import { Newspaper, Search, Loader, ExternalLink, Calendar, HelpCircle, Star, Sparkles } from 'lucide-react';
import { newsAPI } from '../services/api';

const NewsPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const data = await newsAPI.getNews();
      setArticles(data.articles);
    } catch (error) {
      console.error('Failed to load news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const data = await newsAPI.searchNews(searchQuery);
      setArticles(data.articles);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    loadNews();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader className="h-10 w-10 animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-sm font-medium text-slate-500">Loading Medical News...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden py-8 font-sans">
      {/* Glow Blur Orbs */}
      <div className="absolute top-[5%] right-[-10%] w-[35%] h-[35%] bg-teal-400/5 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[5%] left-[-10%] w-[35%] h-[35%] bg-violet-400/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header and Search */}
        <div className="mb-10 max-w-3xl">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2 mb-2">
            <Newspaper className="h-8 w-8 text-teal-500" />
            Health & Medical News
          </h1>
          <p className="text-sm text-slate-500 mb-6">Stay informed with the latest updates and breakthroughs in medical research.</p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search medical topics, wellness advice, vaccine news..."
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 rounded-xl text-sm outline-none text-slate-800 transition"
              />
            </div>
            <button
              type="submit"
              disabled={searching}
              className="bg-gradient-to-tr from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold px-6 py-3 rounded-xl transition shadow-md shadow-teal-900/10 disabled:from-slate-200 disabled:to-slate-250 disabled:shadow-none disabled:cursor-not-allowed text-sm"
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3 rounded-xl transition border border-slate-200 text-sm"
              >
                Clear
              </button>
            )}
          </form>
        </div>

        {/* News Grid */}
        {articles.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/50 p-12 text-center max-w-xl mx-auto">
            <Newspaper className="h-16 w-16 text-slate-350 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Articles Found</h3>
            <p className="text-slate-500 text-sm">We couldn't find any health news matching your query. Try searching for "COVID", "Heart", or "Diet".</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <div key={index} className="group bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-200/50 hover:shadow-xl hover:shadow-slate-100 hover:border-slate-300 transition-all duration-300 transform hover:-translate-y-0.5 flex flex-col justify-between">
                <div>
                  {/* Article Thumbnail */}
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={article.urlToImage || 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=400&auto=format&fit=crop'}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=400&auto=format&fit=crop';
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-slate-900/80 backdrop-blur-sm text-teal-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-teal-500/20">
                        {article.source?.name || 'Medical Bulletin'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Article Content */}
                  <div className="p-6">
                    <div className="flex items-center text-xs text-slate-400 mb-2">
                      <Calendar className="h-3.5 w-3.5 mr-1 text-slate-400" />
                      {new Date(article.publishedAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                    
                    <h3 className="text-base font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-teal-700 transition-colors leading-snug">
                      {article.title}
                    </h3>
                    
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-3 mb-4">
                      {article.description || 'No description available. Access the link to read the complete article details on the host webpage.'}
                    </p>
                  </div>
                </div>

                {/* Footer Action Links */}
                <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-slate-50">
                  <span className="text-xs font-bold text-teal-600">
                    Health News
                  </span>
                  
                  {article.url && article.url !== '#' && (
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-slate-700 hover:text-teal-700 text-xs font-bold transition-colors"
                    >
                      <span>Read More</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Informational Banner */}
        <div className="mt-10 bg-gradient-to-r from-teal-50/50 via-cyan-50/40 to-slate-100/10 border-l-4 border-teal-500 p-6 rounded-r-3xl border border-teal-100/50">
          <h3 className="text-base font-bold text-teal-900 mb-2 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-teal-600" />
            Verified Medical Bulletins
          </h3>
          <p className="text-teal-850 text-sm leading-relaxed">
            Stay updated with verified updates from trusted publications. These articles are aggregated from various health publications to keep you informed on therapeutic discoveries, vaccines, nutrition, and international wellness guidelines.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
