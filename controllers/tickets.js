const models = require('../models');

exports.validateTicket = async (req, res) => {

    try {
        const { uuid } = req.params;
        const { availableTicket } = req.query;

        const validator = req.validator;

        const ticket = await models.Ticket.findByPk(uuid, {
            include: [{
                model: models.AvailableTicket,
                as: 'availableTicketDetails'
            }]
        });


        if (!ticket) {
            return res.status(404).send({
                error: "Ticket not found"
            });
        }

        if (validator.event != ticket.availableTicketDetails.event) {
            return res.status(403).send({
                error: "You are not authorized to validate this ticket"
            });
        }

        // Check if the ticket is associated with the available ticket
        if (availableTicket && ticket.availableTicketDetails.uuid !== availableTicket) {
            return res.status(400).send({
                error: "Ticket does not belong to the specified available ticket"
            });
        }

        // Validate the ticket
        if (ticket.validated) {
            return res.status(400).send({
                error: "Ticket already validated"
            });
        }

        // Update the ticket status to validated
        ticket.validated = true;
        await ticket.save();


        res.status(200).send({
            msg: "Ticket validated successfully",
        });

        const socket = req.app.get('socketio');
        socket.emit('stats_' + ticket.availableTicketDetails.event, {
            action: 'validate',
            ticket: {
                availableTicket: ticket.availableTicketDetails.uuid,
            }
        });
    } catch (error) {
        console.error("Error validating ticket:", error);
        return res.status(500).send({
            error: "Error when validating ticket"
        });
    }
}