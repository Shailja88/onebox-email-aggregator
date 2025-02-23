const { sendSlackNotification } = require('./services/notifications');

sendSlackNotification({ subject: "Test Email", from: "no-reply@example.com" })
    .then(() => console.log("✅ Slack test message sent successfully!"))
    .catch(err => console.error("❌ Slack test message failed:", err));
