const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// verify connection (optional)
transporter.verify().then(() => {
  console.log('SMTP Ready');
}).catch(err => {
  console.warn('SMTP verify failed:', err.message);
});

async function sendVerificationEmail(toEmail, name, verifyUrl) {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: toEmail,
    subject: 'Verify your email for Your SaaS',
    html: `
      <p>Hi ${name},</p>
      <p>Thanks for signing up — please verify your email by clicking the link below:</p>
      <p><a href="${verifyUrl}" target="_blank">Verify my email</a></p>
      <p>If the link doesn't work, copy-paste this URL into your browser:</p>
      <p>${verifyUrl}</p>
      <p>Cheers,<br/>The Team</p>
    `
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendVerificationEmail };
