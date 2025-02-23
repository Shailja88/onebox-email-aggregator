const axios = require('axios');
require('dotenv').config(); // Ensure dotenv is loaded

// Function to send Slack notification
const sendSlackNotification = async (email) => {
    try {
        const webhookURL = process.env.SLACK_WEBHOOK_URL; // Fetch webhook URL from .env
        if (!webhookURL) {
            throw new Error('⚠️ Slack Webhook URL is missing in .env file!');
        }

        const message = {
            text: `📩 *New Email Received:*\n*Subject:* ${email.subject}\n*From:* ${email.from}`
        };

        const response = await axios.post(webhookURL, message);
        console.log(`✅ Slack notification sent! Status: ${response.status}`);
    } catch (error) {
        console.error('❌ Error sending Slack notification:', error.message);
    }
};

// Function to send notification to a custom webhook
const sendWebhookNotification = async (email) => {
    try {
        const webhookURL = 'https://webhook.site/YOUR_WEBHOOK_URL'; // Replace with actual webhook
        const response = await axios.post(webhookURL, { email });
        console.log(`✅ Webhook notification sent! Status: ${response.status}`);
    } catch (error) {
        console.error('❌ Error sending Webhook notification:', error.message);
    }
};

module.exports = { sendSlackNotification, sendWebhookNotification };
