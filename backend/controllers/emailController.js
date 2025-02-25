const Email = require('../models/Email');
const { indexEmail } = require('../services/elasticsearch');
const { sendSlackNotification, sendWebhookNotification } = require('../services/notifications');

const getEmails = async (req, res) => {
    try {
        const emails = await Email.find({});
        
        console.log("📩 Emails from DB:", emails);  // ✅ Debugging

        res.json(emails);
    } catch (error) {
        console.error("❌ Error fetching emails:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const markInterested = async (req, res) => {
    const { emailId } = req.body;
    const email = await Email.findById(emailId);
    
    if (email) {
        email.category = "Interested";
        await email.save();
        
        await sendSlackNotification(email);
        await sendWebhookNotification(email);
        
        res.json({ message: "Email marked as Interested" });
    } else {
        res.status(404).json({ message: "Email not found" });
    }
};

module.exports = { getEmails, markInterested };
