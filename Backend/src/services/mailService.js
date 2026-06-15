const nodemailer = require('nodemailer');
const env = require('../config/env');

const createTransporter = () => {
  if (
    !env.email.host ||
    env.email.user === 'your_smtp_username'
  ) {
    console.warn('Mail Service: SMTP credentials are not configured. Mails will be logged to console.');
    return null;
  }

  return nodemailer.createTransport({
    host: env.email.host,
    port: env.email.port,
    auth: {
      user: env.email.user,
      pass: env.email.pass
    }
  });
};

/**
 * Send an email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} text - Plain text body
 * @param {string} html - HTML email body
 */
const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: env.email.from,
    to,
    subject,
    text,
    html
  };

  if (!transporter) {
    console.log('--- Mock Email Sent ---');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Text: ${text}`);
    console.log('-----------------------');
    return true;
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

module.exports = { sendEmail };
