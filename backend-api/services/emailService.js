const nodemailer = require('nodemailer');
const { getPasswordResetEmailTemplate } = require('../utils/emailTemplates');

const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: Number(process.env.MAILTRAP_PORT),
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
    }
});

const sendPasswordResetEmail = async (email, resetToken, userName = 'User') => {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const info = await transporter.sendMail({
        from: '"Messaging App" <hello@demomailtrap.co>',
        to: email,
        subject: '🔐 Reset Your Message App Password',
        html: getPasswordResetEmailTemplate(userName, resetLink)
    });

    console.log('✅ Password reset email sent to Mailtrap!');
    return info;
};

module.exports = sendPasswordResetEmail;