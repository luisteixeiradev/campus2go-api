const eupago = require('@api/eupago');

exports.payByLink = async (data) => {
    try {
        eupago.auth(`ApiKey ${process.env.EUPAGO_API_KEY}`);
        const res = await eupago.paybylink({
            payment: {
                amount: { currency: 'EUR', value: data.total_amount },
                lang: 'PT',
                identifier: data.uuid,
                successUrl: 'https://campus2go.luisteixera.dev/purchases/success',
                failUrl: 'https://campus2go.luisteixera.dev/purchases/fail',
                backUrl: 'https://campus2go.luisteixera.dev/purchases/back',
            },
            customer: {
                name: data.name,
                email: data.email,
            },
            products: data.tickets.map(ticket => ({
                name: `${ticket.availableTicketDetails.eventDetails.name} - ${ticket.availableTicketDetails.name}`,
                quantity: 1,
                value: ticket.price
            }))
                .concat({
                    name: 'Taxa de serviço',
                    quantity: 1,
                    value: data.total_fee_amount || (data.total_amount * 0.06) // Assuming a 6% service fee if not provided
                }),
            customer: {
                name: data.name,
                email: data.email,
                notify: true
            }
        })
        return res;
    } catch (error) {
        console.log(error);

        throw new Error(`Pay by link payment failed: ${error.message}`);
    }
}