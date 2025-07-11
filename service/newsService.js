const RSSParser = require('../utils/rssParser');
const NewsFormatter = require('../utils/newsFormatter');

class NewsService {
  constructor(config) {
    this.config = config;
    this.lastNewsIds = new Set();
  }

  async fetchAndFormatNews() {
    try {
      const newsItems = await RSSParser.getLatestNews(
        this.config.RSS_FEEDS,
        this.config.MAX_NEWS_PER_FEED,
        this.config.FILTER_KEYWORDS
      );

      // Filter out already sent news
      const newItems = newsItems.filter(item => {
        const id = item.guid || item.link || item.title;
        return !this.lastNewsIds.has(id);
      });

      // Update sent news IDs
      newItems.forEach(item => {
        const id = item.guid || item.link || item.title;
        this.lastNewsIds.add(id);
      });

      // Keep only recent IDs to prevent memory bloat
      if (this.lastNewsIds.size > 1000) {
        const idsArray = Array.from(this.lastNewsIds);
        this.lastNewsIds = new Set(idsArray.slice(-500));
      }

      return NewsFormatter.formatNewsMessage(newItems);
    } catch (error) {
      console.error('Error in fetchAndFormatNews:', error);
      return NewsFormatter.formatErrorMessage(error);
    }
  }
}

module.exports = NewsService;