const Parser = require('rss-parser');
const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
});

class RSSParser {
  static async fetchFeed(feedUrl) {
    try {
      const feed = await parser.parseURL(feedUrl);
      return feed.items || [];
    } catch (error) {
      console.error(`Error fetching ${feedUrl}:`, error.message);
      return [];
    }
  }

  static filterByKeywords(items, keywords) {
    if (!keywords || keywords.length === 0) return items;
    
    return items.filter(item => {
      const text = `${item.title} ${item.contentSnippet || item.content || ''}`.toLowerCase();
      return keywords.some(keyword => text.includes(keyword.toLowerCase()));
    });
  }

  static formatNewsItem(item, sourceName) {
    const title = item.title || 'No Title';
    const link = item.link || '';
    const pubDate = item.pubDate ? new Date(item.pubDate).toLocaleString('id-ID') : '';
    
    return `📰 *${title}*\n⏰ ${pubDate}\n🔗 ${link}\n📍 ${sourceName}\n`;
  }

  static async getLatestNews(feeds, maxPerFeed = 3, keywords = []) {
    const allNews = [];
    
    const fetchPromises = feeds.map(async (feed) => {
      const items = await this.fetchFeed(feed.url);
      const filtered = this.filterByKeywords(items, keywords);
      const latest = filtered.slice(0, maxPerFeed);
      
      return latest.map(item => ({
        ...item,
        sourceName: feed.name,
        timestamp: new Date(item.pubDate || Date.now()).getTime()
      }));
    });
    
    const results = await Promise.allSettled(fetchPromises);
    
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        allNews.push(...result.value);
      }
    });
    
    // Sort by timestamp (newest first)
    return allNews.sort((a, b) => b.timestamp - a.timestamp);
  }
}

module.exports = RSSParser;
