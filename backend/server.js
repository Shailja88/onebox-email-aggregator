require('dotenv').config();
const express = require('express');
const mongoose = require('./config/db');
const cors = require('cors');
const emailRoutes = require('./routes/emailRoutes');
const authRoutes = require('./routes/authRoutes');
const fetchEmails = require('./services/imapService');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
// 🔥 Debugging Middleware
app.use((req, res, next) => {
    console.log(`➡️ Incoming Request: ${req.method} ${req.url}`);
    console.log(`📩 Body:`, req.body);
    console.log("📩 Parsed Body (After express.json()):", req.body); // ✅ Check parsed body
    
    next();
});

// 🔥 CORS Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"], // ✅ Ensure POST is allowed
  allowedHeaders: ["Content-Type", "Authorization"] // ✅ Headers allow karo
}));



app.use('/api/emails', emailRoutes);
app.use('/api/auth', authRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to OneBox Email Aggregator API!");
});

// ✅ Debugging log: Routes are loaded
console.log("✅ Email & Auth Routes Loaded");

// Start IMAP Email Sync
fetchEmails();

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

