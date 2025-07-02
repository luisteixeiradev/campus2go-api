const nodemailer = require('nodemailer');
const token = require('./token');
const path = require('path');
const fs = require('fs');

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
        subject: 'Validação de Email',
        text: `Por favor valide o seu email.\nlink: ${process.env.APP_URL}/validate/${userToken}`
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
        subject: 'Recuperar password',
        text: `Por favor reponha a sua password.\nLink: ${process.env.APP_URL}?action=resetpassword&token=${userToken}`
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
        subject: 'Alteração de password',
        text: `A sua password foi alterada.`
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
        subject: 'Aletração de email',
        text: `O seu email foi alterado.`
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
        subject: 'Promotor Criado',
        text: `O sua conta de promotor foi criada.\nEmail: ${user.email}\nPassword: ${password}`
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
        subject: 'Eliminação de conta',
        text: `A sua conta foi eliminada.`
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }

}

exports.sendTickets = async (purchase) => {

    const eventName = purchase.tickets[0].availableTicketDetails.eventDetails.name;

    const attachments = purchase.tickets.map(ticket => ({
        filename: `${ticket.uuid}.pdf`,
        path: path.join(__dirname, '../tickets', `${ticket.uuid}.pdf`),
        contentType: 'application/pdf'
    }));

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: purchase.email,
        subject: `Bilhetes - ${eventName}`,
        text: `Os seus bilhetes, para o evento ${eventName}, foram gerados com sucesso.`,
        attachments: attachments
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }

}