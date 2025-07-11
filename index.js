
const WhatsAppClient = require('./utils/whatsappClient');
const NewsService = require('./service/newsService');
const config = require('./config');

class RSSBot {
  constructor() {
    this.whatsappClient = new WhatsAppClient();
    this.newsService = new NewsService(config);
    this.intervalId = null;
    this.isRunning = false;
  }

  async initialize() {
    console.log('🚀 Memulai RSS Bot...');
    
    const success = await this.whatsappClient.initialize();
    if (!success) {
      throw new Error('Gagal initialize WhatsApp client');
    }

    console.log('✅ Bot siap berjalan!');
    return true;
  }

  async sendNews() {
    if (!this.isRunning) return;

    try {
      console.log('📡 Mengambil berita terbaru...');
      const message = await this.newsService.fetchAndFormatNews();
      
      console.log('📤 Mengirim pesan...');
      const sent = await this.whatsappClient.sendMessage(config.TARGET_NUMBER, message);
      
      if (sent) {
        console.log('✅ Pesan berhasil dikirim');
      } else {
        console.log('❌ Gagal mengirim pesan');
      }
    } catch (error) {
      console.error('Error dalam sendNews:', error);
    }
  }

  start() {
    if (this.isRunning) {
      console.log('⚠️ Bot sudah berjalan');
      return;
    }

    this.isRunning = true;
    console.log(`🔄 Bot dimulai dengan interval ${config.INTERVAL_MINUTES} menit`);
    
    // Send immediately
    this.sendNews();
    
    // Set interval
    this.intervalId = setInterval(() => {
      this.sendNews();
    }, config.INTERVAL_MINUTES * 60 * 1000);
  }

  stop() {
    if (!this.isRunning) {
      console.log('⚠️ Bot sudah berhenti');
      return;
    }

    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    console.log('🛑 Bot dihentikan');
  }

  async destroy() {
    this.stop();
    await this.whatsappClient.destroy();
    console.log('💀 Bot dihancurkan');
  }
}

// Main execution
async function main() {
  const bot = new RSSBot();
  
  try {
    await bot.initialize();
    bot.start();
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🛑 Menerima signal untuk shutdown...');
      await bot.destroy();
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      console.log('\n🛑 Menerima signal untuk terminate...');
      await bot.destroy();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Error menjalankan bot:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = RSSBot;