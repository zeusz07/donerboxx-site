const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Orijinleri izin ver
app.use(cors());
app.use(express.json());

// Statik dosyaları frontend klasöründen sun
app.use(express.static(path.join(__dirname, 'frontend')));

// Ana sayfa yönlendirmesi
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Ödeme endpointi
app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: req.body.items,
      mode: 'payment',
      success_url: 'https://donerboxx.com/success.html',
      cancel_url: 'https://donerboxx.com/cancel.html',
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bilinmeyen tüm yolları index.html'e yönlendir (404 çözümü)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Sunucuyu başlat
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});