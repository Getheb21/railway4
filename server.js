const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// VMESS Config
const VMESS_CONFIG = {
  v:  '2',
  ps: process.env.VMESS_NAME || 'Railway VMESS',
  add:  process.env.VMESS_HOST || 'localhost',
  port: process.env.VMESS_PORT || 443,
  id: process.env.VMESS_UUID || 'eb6aaeac-ae38-4e50-9f6b-f88372dc31b9',
  aid: process.env.VMESS_AID || '0',
  scy: 'auto',
  net: process.env.VMESS_NET || 'ws',
  type: 'none',
  host: process.env.VMESS_HOST || 'localhost',
  path: process.env.VMESS_PATH || '/vmess',
  tls: process.env.VMESS_TLS || 'tls',
  sni: process.env.VMESS_SNI || 'localhost'
};

app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'VMESS Server Running',
    message: 'Use /config to get VMESS config',
    timestamp: new Date().toISOString()
  });
});

// Get VMESS Config in base64
app.get('/config', (req, res) => {
  try {
    const configStr = JSON.stringify(VMESS_CONFIG);
    const base64 = Buffer.from(configStr).toString('base64');
    const vmessLink = `vmess://${base64}`;
    
    res.json({
      status: 'success',
      config: VMESS_CONFIG,
      link: vmessLink,
      qrcode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(vmessLink)}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ VMESS Server running on port ${PORT}`);
  console.log(`✓ Visit http://localhost:${PORT} to check status`);
});