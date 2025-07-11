const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

class WhatsAppClient {
  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      }
    });
    
    this.isReady = false;
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.client.on('qr', (qr) => {
      console.log('📱 Scan QR code di bawah ini dengan WhatsApp:');
      qrcode.generate(qr, { small: true });
    });

    this.client.on('ready', () => {
      console.log('✅ WhatsApp Client siap!');
      this.isReady = true;
    });

    this.client.on('authenticated', () => {
      console.log('🔐 WhatsApp berhasil authenticated');
    });

    this.client.on('auth_failure', (msg) => {
      console.error('❌ Authentication gagal:', msg);
    });

    this.client.on('disconnected', (reason) => {
      console.log('⚠️ WhatsApp disconnected:', reason);
      this.isReady = false;
    });
  }

  async initialize() {
    try {
      await this.client.initialize();
      
      // Wait until ready
      while (!this.isReady) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      return true;
    } catch (error) {
      console.error('Error initializing WhatsApp client:', error);
      return false;
    }
  }

  async sendMessage(targetNumber, message) {
    if (!this.isReady) {
      throw new Error('WhatsApp client not ready');
    }

    try {
      await this.client.sendMessage(targetNumber, message);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }

  async destroy() {
    if (this.client) {
      await this.client.destroy();
    }
  }
}

module.exports = WhatsAppClient;
