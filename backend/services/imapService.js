const Imap = require('imap');
const { simpleParser } = require('mailparser');
const Email = require('../models/Email');
const classifyEmail = require('./aiCategorization');
const { sendSlackNotification } = require('../services/notifications'); // Import Slack function


const imapConfig = {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false } // ✅ Ignore self-signed certificate
};
const formatMessage = (subject, sender, link) => {
    return `📩 *New Email Received:*\n` +
           `📌 *Subject:* ${subject || "No Subject"}\n` +
           `✉️ *From:* ${sender || "Unknown Sender"}\n` +
           `🔗 <${link}|View Email>`;  // Shortened clickable link
};

// ✅ Fetch Emails Function
const fetchEmails = () => {
    const imap = new Imap(imapConfig);

    imap.once('ready', () => {
        imap.openBox('INBOX', false, (err, box) => {
            if (err) {
                console.error('❌ Error opening inbox:', err);
                imap.end();
                return;
            }

            const fetch = imap.seq.fetch(`${box.messages.total}:*`, { bodies: '' });

            fetch.on('message', (msg, seqno) => {
                console.log(`📩 Fetching email #${seqno}`);

                msg.on('body', async (stream) => {
                    try {
                        const parsed = await simpleParser(stream);
                        console.log("📅 Raw Parsed Date:", parsed.date);  

                        // ✅ Ensure receivedAt is always valid
                        const receivedAt = parsed.date ? new Date(parsed.date) : new Date();

                        const category = classifyEmail(parsed.text || "");

                        // ✅ Save Email to DB
                        const email = new Email({
                            sender: parsed.from?.text || "Unknown Sender",
                            recipient: parsed.to?.text || "Unknown Recipient",
                            subject: parsed.subject || "No Subject",
                            body: parsed.text || "No Body",
                            receivedAt, 
                            category
                        });

                        await email.save();
                        console.log(`✅ Email #${seqno} saved successfully`);

                        // ✅ Send Slack Notification with Dynamic Link
                        const emailLink = `https://yourapp.com/email/${email._id}`;  // 👈 Dynamic Link
                        const slackMessage = formatMessage(parsed.subject, parsed.from?.text, emailLink);

                        await sendSlackNotification({ message: slackMessage });

                    } catch (err) {
                        console.error('❌ Error parsing email:', err);
                    }
                });

                msg.once('end', () => console.log(`✅ Email #${seqno} processed`));
            });

            fetch.once('end', () => {
                console.log('✅ All emails fetched, closing IMAP connection...');
                imap.end();
            });

            fetch.once('error', (err) => {
                console.error('❌ Error fetching emails:', err);
                imap.end();
            });
        });
    });

    imap.once('error', (err) => {
        console.error('❌ IMAP Connection Error:', err);
    });

    imap.once('end', () => {
        console.log('📭 IMAP Connection Closed');
    });

    imap.connect();
};

module.exports = fetchEmails;
