
// README.md
# WhatsApp RSS News Bot

Bot otomatis untuk mengirim berita RSS ke WhatsApp pribadi.

## Instalasi

1. **Install Node.js** (versi 16 atau lebih baru)
2. **Clone/Download project ini**
3. **Install dependencies:**
   ```bash
   npm install
   ```

## Konfigurasi

1. **Edit `config.js`:**
   - Ganti `TARGET_NUMBER` dengan nomor WhatsApp Anda
   - Format: `"6281234567890@c.us"` (62 + nomor tanpa 0 di depan)
   - Sesuaikan RSS feeds, interval, dan keywords

2. **Contoh nomor WhatsApp:**
   ```javascript
   // Jika nomor HP: 081234567890
   TARGET_NUMBER: "6281234567890@c.us"
   ```

## Menjalankan Bot

1. **Jalankan script:**
   ```bash
   npm start
   ```

2. **Scan QR Code:**
   - QR code akan muncul di terminal
   - Scan dengan WhatsApp di HP Anda
   - Tunggu hingga muncul "WhatsApp Client siap!"

3. **Bot berjalan otomatis:**
   - Mengirim berita setiap 1 menit (default)
   - Tekan `Ctrl+C` untuk berhenti

## Fitur

- ✅ Auto-send berita RSS ke WhatsApp
- ✅ Filter berdasarkan keywords
- ✅ Support multiple RSS feeds
- ✅ Format pesan yang rapi
- ✅ Deteksi berita duplikat
- ✅ Error handling yang robust
- ✅ Modular dan mudah dikustomisasi

## Troubleshooting

**QR Code tidak muncul:**
- Pastikan terminal mendukung QR code
- Coba restart script

**Pesan tidak terkirim:**
- Periksa format nomor WhatsApp
- Pastikan koneksi internet stabil
- Pastikan WhatsApp tidak logout

**RSS feed error:**
- Periksa URL RSS feed
- Beberapa feed mungkin diblokir

## Kustomisasi

- **Tambah RSS feed:** Edit `RSS_FEEDS` di `config.js`
- **Ubah interval:** Edit `INTERVAL_MINUTES` di `config.js`
- **Tambah filter:** Edit `FILTER_KEYWORDS` di `config.js`
- **Extend fitur:** Modifikasi file di folder `utils/` dan `services/`