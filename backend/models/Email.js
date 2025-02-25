const mongoose = require('mongoose');

const EmailSchema = new mongoose.Schema({
    sender: String,
    recipient: String,
    subject: String,
    body: String,
    receivedAt: { type: Date, default: Date.now },  // ✅ Default timestamp added
    category: {
        type: String,
        enum: ["Interested", "Meeting Booked", "Not Interested", "Out of Office", "Spam", "Not Categorized"],
        default: "Not Categorized"
    }
});

module.exports = mongoose.model('Email', EmailSchema);
