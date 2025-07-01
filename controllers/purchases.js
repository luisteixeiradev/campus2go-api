const models = require('../models');
const token = require('../utils/token');
const eupago = require('../utils/eupago');

exports.getPurchases = async (req, res) => {
    try {
        const { user } = req;

        const purchases = await models.Purchase.findAll({
            where: { user: user.uuid },
            include: [{
                model: models.Ticket,
                include: [{
                    model: models.Event,
                    attributes: ['uuid', 'name', 'date']
                }]
            }]
        });

        return res.status(200).send(purchases);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: "Error fetching purchases" });
    }
}

exports.createPurchase = async (req, res) => {

    try {
        const { user } = req;
        const { name, email, tickets, availableTicket } = req.body;

        if (!tickets || !Array.isArray(tickets) || tickets.length === 0) {
            return res.status(400).send({ error: "Tickets must be an array and cannot be empty" });
        }

        const availableTicketInstance = await models.AvailableTicket.findByPk(availableTicket, {
            attributes: {
                include: [
                    [
                        models.Sequelize.literal(`(
            SELECT COUNT(*) FROM tickets AS t WHERE t.availableTicket = '${availableTicket}' AND t.status IN ('reserved', 'available')
            )`),
                        'usedTicketsCount'
                    ]
                ]
            }
        });

        // console.log("Available Ticket Instance", availableTicketInstance);


        // return res.status(200).send({ availableTicketInstance });

        if (!availableTicketInstance) {
            return res.status(404).send({ error: "Available ticket not found" });
        }

        if (!availableTicketInstance.active) {
            return res.status(400).send({ error: "Available ticket is not active" });
        }

        if (availableTicketInstance.capacity >= availableTicketInstance.dataValues.usedTicketsCount + tickets.length) {

            // Check if the user exist with the provided email
            const userInstance = await models.User.findOne({
                where: { email },
            });

            // Create purchase and tickets
            const totalTicketsAmount = tickets.length * availableTicketInstance.price;
            const totalFeeAmount = totalTicketsAmount * 0.06; // Assuming a 6% fee on the total ticket amount
            const totalAmount = totalTicketsAmount + totalFeeAmount;

            // return res.status(200).send({user});

            let purchase = await models.Purchase.create({
                user: user?.uuid || userInstance?.uuid || null,
                name,
                email,
                total_tickets_amount: totalTicketsAmount,
                total_fee_amount: totalFeeAmount,
                total_amount: totalAmount
            }, {
                include: [{
                    model: models.Ticket,
                    as: 'tickets'
                }]
            });

            const ticketsInstances = [];

            for (const ticket of tickets) {
                const { name, email, answers } = ticket;
                const newTicket = await models.Ticket.create({
                    name,
                    email,
                    availableTicket: availableTicketInstance.uuid,
                    purchase: purchase.uuid,
                    price: availableTicketInstance.price,
                    answers
                }, {
                    include: [{
                        model: models.Answer,
                        as: 'answers',
                        include: [
                            {
                                model: models.Form,
                                as: 'formDetails',

                            }
                        ]
                    }]
                });
                ticketsInstances.push(newTicket);
            }

            // const purchaseId = purchase.uuid;
            purchase = await models.Purchase.findByPk(purchase.uuid, {
                include: [{
                    model: models.Ticket,
                    as: 'tickets',
                    include: [{
                        model: models.Answer,
                        as: 'answers',
                        include: [
                            {
                                model: models.Form,
                                as: 'formDetails',
                                attributes: ['question']
                            }
                        ]
                    },
                    {
                        model: models.AvailableTicket,
                        as: 'availableTicketDetails',
                        include: [{
                            model: models.Event,
                            as: 'eventDetails',
                        }]
                    }]
                }]
            });


            // const ticketsInstances = await models.Ticket.bulkCreate(


            // )

            // for (const ticket of tickets) {
            //     const { answers } = ticket;

            //     const newTicket = await models.Ticket.create({
            //         purchase: purchase.uuid,
            //         availableTicket: availableTicket.uuid,

            //     });

            //     if (answers && Array.isArray(answers)) {
            //         for (const answer of answers) {
            //             const { questionId, answerText } = answer;
            //             await models.Answer.create({
            //                 ticketUuid: newTicket.uuid,
            //                 questionUuid: questionId,
            //                 answer: answerText
            //             });
            //         }
            //     }
            // }

            const tokenPurchase = await token.generateToken(purchase, 'purchase');

            return res.status(201).send({ purchase, token: tokenPurchase });

        } else {
            return res.status(400).send({ error: "Not enough capacity for the available ticket" });
        }




    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: "Error creating purchase" });
    }

}

exports.payPurchase = async (req, res) => {

    try {
        const { token: purchaseToken } = req.query;

        const decodedToken = await token.decodeToken(purchaseToken);
        const purchase = await models.Purchase.findOne({
            where: { uuid: decodedToken.uuid, status: 'reserved' },
            include: [{
                model: models.Ticket,
                as: 'tickets',
                include: [{
                    model: models.AvailableTicket,
                    as: 'availableTicketDetails',
                    include: [{
                        model: models.Event,
                        as: 'eventDetails',
                    }]
                }]
            }],
        });

        if (!purchase) {
            return res.status(404).send({ error: "Purchase not found or already paid" });
        }

        if (purchase.total_amount == 0) {
            // If total amount is 0, mark as paid and return success
            // This is a special case, usually for free tickets or events

            purchase.status = 'paid';
            await purchase.tickets.forEach(ticket => {
                ticket.status = 'available';
            });
            await models.sequelize.transaction(async (transaction) => {
                await purchase.save({ transaction });
                await Promise.all(purchase.tickets.map(ticket => ticket.save({ transaction })));
            });
            return res.status(200).send({
                message: "Purchase completed successfully",
                purchase
            });

        } else {
            const data = await eupago.payByLink(purchase);
            res.status(200).send({
                message: "Payment link created successfully",
                data: data.data
            });
            purchase.status = 'waiting_payment';
            purchase.save();
            
        }


    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: "Error processing payment" });
    }

}

exports.deletePurchase = async (req, res) => {
    try {

        const { token: purchaseToken } = req.query;

        const decodedToken = await token.decodeToken(purchaseToken);

        await models.sequelize.transaction(async (transaction) => {
            // Delete tickets associated with the purchase
            await models.Ticket.destroy({
                where: { purchase: decodedToken.uuid },
                transaction
            });

            // Delete the purchase itself
            await models.Purchase.destroy({
                where: { uuid: decodedToken.uuid, status: 'reserved' },
                transaction
            });
        });

        return res.status(200).send({ message: "Purchase deleted successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: "Error deleting purchase" });
    }
}

exports.confirmPurchasePayment = async (req, res) => {

    try {
        const { identificador, chave_api } = req.query;

        console.log("Confirming purchase payment with identificador:", req.query);
        

        if (chave_api == process.env.EUPAGO_API_KEY) {
            const purchase = await models.Purchase.findOne({
                where: { uuid: identificador, status: 'waiting_payment' },
                include: [{
                    model: models.Ticket,
                    as: 'tickets',
                }],
            });

            if (!purchase) {
                return res.status(404).send({ error: "Purchase not found or already paid" });
            }

            purchase.status = 'paid';
            await purchase.tickets.forEach(ticket => {
                ticket.status = 'available';
            });

            await models.sequelize.transaction(async (transaction) => {
                await purchase.save({ transaction });
                await Promise.all(purchase.tickets.map(ticket => ticket.save({ transaction })));
            });

            res.status(200).send({
                message: "Purchase payment confirmed successfully",
                purchase
            });
            
        }

    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: "Error confirming purchase payment" });
    }

}