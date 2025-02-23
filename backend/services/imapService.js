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
                        const category = classifyEmail(parsed.text || "");

                        const email = new Email({
                            sender: parsed.from.text,
                            recipient: parsed.to.text,
                            subject: parsed.subject,
                            body: parsed.text,
                            receivedAt: parsed.date,
                            category
                        });

                        await email.save();
                        console.log(`✅ Email #${seqno} saved successfully`);

                        // ✅ Send Slack Notification
                        await sendSlackNotification({ 
                            subject: parsed.subject, 
                            from: parsed.from.text 
                        });
                    } catch (err) {
                        console.error('❌ Error parsing email:', err);
                    }
                });

                msg.once('end', () => console.log(`✅ Email #${seqno} processed`));
            });

            fetch.once('end', () => {
                console.log('✅ All emails fetched, closing IMAP connection...');
                imap.end(); // ✅ Properly closing IMAP connection
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
