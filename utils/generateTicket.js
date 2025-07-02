const fs = require('fs');
const path = require('path');
const { createCanvas, registerFont, loadImage, Image } = require('canvas');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const sendEmails = require('./sendEmails');

const generateTicket = async (purchase) => {

    if (!fs.existsSync(path.join(__dirname, '../tickets'))) {
        fs.mkdirSync(path.join(__dirname, '../tickets'), { recursive: true });
    }

    const tickets = purchase.tickets;

    await tickets.map(async (ticket) => {
        const data = {
            eventName: ticket.availableTicketDetails.eventDetails.name,
            promoterName: ticket.availableTicketDetails.eventDetails.promoterDetails.name,
            promoterLogo: ticket.availableTicketDetails.eventDetails.promoterDetails.image ? ticket.availableTicketDetails.eventDetails.promoterDetails.image : 'default-logo.png',
            name: ticket.name,
            eventDate: ticket.availableTicketDetails.eventDetails.startDate.toLocaleDateString('pt-PT', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }) + ' | ' + ticket.availableTicketDetails.eventDetails.startDate.toLocaleTimeString('pt-PT', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            space: ticket.availableTicketDetails.eventDetails.spaceDetails.name,
            type: ticket.availableTicketDetails.name,
            price: ticket.price.toLocaleString("pt-PT", {
                style: "currency",
                currency: "EUR",
            }),

        }

        const width = 600;
        const height = 300;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 600, 300);
        const imgBrand = await loadImage(path.join(__dirname, '../templates/tickets/Campus2Go.svg'));

        ctx.drawImage(imgBrand, 20, 20, 100, 100 * imgBrand.height / imgBrand.width);

        ctx.fillStyle = '#1a1a1a';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(data.promoterName, canvas.width - 20, 40);

        ctx.textAlign = 'left';

        ctx.fillStyle = '#1a1a1a';
        ctx.font = 'bold 20px Arial';
        ctx.fillText(data.eventName, 20, 100);

        ctx.fillStyle = '#1a1a1a';
        ctx.font = 'normal 16px Arial';
        ctx.fillText(data.space, 20, 130);

        ctx.fillStyle = '#1a1a1a';
        ctx.font = 'normal 16px Arial';
        ctx.fillText(data.eventDate, 20, 160);

        ctx.fillStyle = '#1a1a1a';
        ctx.font = 'normal 16px Arial';
        ctx.fillText(data.type, 20, canvas.height - 60);

        ctx.fillStyle = '#1a1a1a';
        ctx.font = 'normal 16px Arial';
        ctx.fillText(data.price, 20, canvas.height - 40);

        ctx.fillStyle = '#1a1a1a';
        ctx.font = 'normal 14px Arial';
        ctx.fillText(data.name, 20, canvas.height - 20);

        const qrDataUrl = await QRCode.toDataURL(ticket.uuid, { margin: 1, width: 120 });
        const imgQRCode = await loadImage(qrDataUrl)

        ctx.drawImage(imgQRCode, canvas.width - 120, canvas.height - 120, 100, 100)

        const imgBuffer = canvas.toBuffer('image/png');
        const doc = new PDFDocument({ margin: 0, size: [width, height] });
        const stream = fs.createWriteStream(path.join(__dirname, '../tickets', `${ticket.uuid}.pdf`));
        doc.pipe(stream);

        doc.image(imgBuffer, 0, 0);

        doc.end();

        stream.on('finish', () => {
            console.log('PDF gerado com sucesso!');
        });
    });

    sendEmails.sendTickets(purchase)

}

module.exports = generateTicket;