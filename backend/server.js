const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const PORT = parseInt(process.env.PORT || 5000, 10);

const app = express();

// ── CORS ────────────────────────────────────────────────────────────────────
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/books',   require('./routes/books'));
app.use('/api/orders',  require('./routes/orders'));
app.use('/api/users',   require('./routes/users'));
app.use('/api/sellers', require('./routes/sellers'));
app.use('/api/admin',   require('./routes/admin'));

app.get('/', (req, res) => res.json({ message: 'BookStore API is running!' }));

// ── Start ────────────────────────────────────────────────────────────────────
let server;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} already in use`);
        process.exit(1);
      }
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// ── Graceful Shutdown ───────────────────────────────────────────────────────
const shutdown = (signal) => {
  console.log(`\n${signal} received. Closing server...`);
  
  if (server) {
    server.close(() => {
      console.log('✅ Server closed');
      mongoose.disconnect().then(() => {
        console.log('✅ MongoDB disconnected');
        process.exit(0);
      });
    });
    
    setTimeout(() => {
      console.error('Forced shutdown');
      process.exit(1);
    }, 5000);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

module.exports = app;
