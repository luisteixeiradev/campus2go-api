const nodemailer = require('nodemailer');
const token = require('./token');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.validateEmail = async (user) => {

    const userToken = await token.generateToken({ uuid: user.uuid }, 'active');

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'Email Verification',
        text: `Please verify your email address.\nlink: ${process.env.APP_URL}/auth/validate/${userToken}`
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }

}

exports.forgotPassword = async (user) => {

    console.log(user.uuid);

    const userToken = await token.generateToken(user , 'forgotPassword');

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'Password Reset',
        text: `Please reset your password.\nlink: ${process.env.APP_URL}/auth/reset-password/${userToken}`
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }

}

exports.changedPassword = async (user) => {

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'Password Changed',
        text: `Your password has been changed.`
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }

}

exports.emailChanged = async (user) => {

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'Email Changed',
        text: `Your email has been changed.`
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }

}

exports.PromoterCreated = async (user, password) => {

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'Promoter Created',
        text: `Your account has been created.\nEmail: ${user.email}\nPassword: ${password}`
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }

}

exports.userDeleted = async (user) => {
    
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'Account Deleted',
        text: `Your account has been deleted.`
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }

}