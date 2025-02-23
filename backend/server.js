require('dotenv').config();
const express = require('express');
const mongoose = require('./config/db');
const cors = require('cors');  // 🟢 CORS import karna na bhulo
const emailRoutes = require('./routes/emailRoutes');
const fetchEmails = require('./services/imapService');

const app = express();

// 🔥 CORS Middleware yaha lagao
app.use(cors({
    origin: 'http://localhost:3000'  // React frontend ka origin
}));

app.use(express.json());
app.use('/api/emails', emailRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to OneBox Email Aggregator API!");
});

// Start IMAP Email Sync
fetchEmails();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
