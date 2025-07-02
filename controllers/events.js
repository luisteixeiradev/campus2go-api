const models = require('../models');
const json2csv = require('json-2-csv');
const { convertCsvToXlsx } = require('@aternus/csv-to-xlsx');
const path = require('path');
const fs = require('fs');
const sendEmails = require('../utils/sendEmails')

exports.getAllEvents = async (req, res) => {

    const { page = 1, limit = 10, startDate, endDate, name, active = undefined, include, sort = "startDate", order = "asc", promoter } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);


    const whereClause = {};

    if (active !== undefined) {
        whereClause.active = active === 'true' ? true : false;
    }

    if (startDate || endDate) {
        whereClause.startDate = {};

        if (startDate) {
            whereClause.startDate[models.Sequelize.Op.gte] = new Date(startDate);
        }

        if (endDate) {
            whereClause.startDate[models.Sequelize.Op.lte] = new Date(endDate);
        }
    }

    // if (startDate && endDate) {
    //     whereClause.startDate = {
    //         [models.Sequelize.Op.gte]: new Date(startDate),
    //         [models.Sequelize.Op.lte]: new Date(endDate)
    //     };
    // }

    if (name) {
        whereClause.name = {
            [models.Sequelize.Op.like]: `%${name}%`
        };
    }

    if (promoter) {
        whereClause.promoter = promoter;
    }

    const includeArray = [];

    if (include) {
        const includes = include.split(',');

        includes.forEach((inc) => {
            if (inc === 'promoter') {
                includeArray.push({
                    model: models.Promoter,
                    as: 'promoterDetails',
                    required: false
                });
            } else if (inc === 'space') {
                includeArray.push({
                    model: models.Space,
                    as: 'spaceDetails',
                    required: false
                });
            }
        });
    }


    try {
        const events = await models.Event.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset,
            include: includeArray,
            order: [[sort, order]],
        });

        return res.status(200).json({
            events: events.rows,
            totalItems: events.count,
            totalPages: Math.ceil(events.count / limit),
            currentPage: parseInt(page),
            itemsPerPage: parseInt(limit)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal server error' });
    }


}

exports.getEventById = async (req, res) => {
    const { uuid } = req.params;
    const { include, availableTickets = 'true' } = req.query;

    try {

        const includeArray = [];

        if (include) {
            const includes = include.split(',');
            includes.forEach((inc) => {
                if (inc === 'promoter') {
                    includeArray.push({
                        model: models.Promoter,
                        as: 'promoterDetails',
                        required: false,
                    });
                } else if (inc === 'space') {
                    includeArray.push({
                        model: models.Space,
                        as: 'spaceDetails',
                        required: false,
                    });
                } else if (inc === 'availableTickets') {
                    includeArray.push({
                        model: models.AvailableTicket,
                        as: 'availableTickets',
                        where: { active: availableTickets == 'true' ? true : false },
                        required: false,
                        include: [
                            {
                                model: models.Zone,
                                as: 'zoneDetails',
                                required: false
                            }
                        ],
                        attributes: {
                            include: [
                                [
                                    models.Sequelize.literal(`(
                                                SELECT COUNT(*) FROM tickets AS t WHERE t.availableTicket = availableTickets.uuid AND t.status IN ('reserved', 'available')
                                                )`),
                                    'sold'
                                ]
                            ]
                        },
                    });
                }
            });
        }

        const event = await models.Event.findOne({
            where: {
                uuid: uuid
            },
            include: includeArray,
        });

        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        return res.status(200).json({ event });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
}

exports.createEvent = async (req, res) => {

    try {
        const { name, description, startDate, endDate, promoter, space } = req.body;

        const json = {
            name,
            description,
            startDate,
            endDate,
            space
        }

        req.user.role == 'promoter' ? json.promoter = req.promoter.uuid : json.promoter = promoter;

        const event = await models.Event.create(json);

        return res.status(201).json({
            msg: 'event created successfully',
            event
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
}

exports.updateEvent = async (req, res) => {
    const { uuid } = req.params;
    const { name, description, startDate, endDate, promoter, space, active } = req.body;

    try {
        const event = await models.Event.findOne({
            where: {
                uuid: uuid,
                ...(req.user.role === 'promoter' ? { promoter: req.promoter.uuid } : {})
            }
        });

        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        const updatedData = {
            name,
            description,
            startDate,
            endDate,
            space,
            active
        };

        if (req.user.role === 'admin') {
            updatedData.promoter = promoter
        }

        await event.update(updatedData);

        return res.status(200).json({
            msg: 'Event updated successfully',
            event
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
}

exports.deleteEvent = async (req, res) => {
    const { uuid } = req.params;

    try {
        const event = await models.Event.findOne({
            where: {
                uuid: uuid,
                ...(req.user.role === 'promoter' ? { promoter: req.promoter.uuid } : {})
            },
            include: [
                {
                    model: models.AvailableTicket,
                    as: 'availableTickets',
                    attributes: {
                        include: [
                            [
                                models.Sequelize.literal(`(
              SELECT COUNT(*) FROM luistei3_campus2go.tickets as t WHERE t.availableTicket = availableTickets.uuid
            )`),
                                'ticketsCount',
                            ],
                        ],
                    },
                },
            ],
        });

        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        if (event.dataValues.active) {
            return res.status(400).json({ msg: 'Cannot delete an active event' });
        }

        for (const ticket of event.dataValues.availableTickets) {
            if (ticket.dataValues.ticketsCount > 0) {
                return res.status(400).json({ msg: 'Cannot delete event with existing tickets' });
            }
        }

        await event.destroy();

        return res.status(200).json({ msg: 'Event deleted successfully' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
}

exports.uploadEventImage = async (req, res) => {
    const { uuid } = req.params;

    try {
        const event = await models.Event.findOne({
            where: { uuid }
        });

        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        const imagePath = `/images/events/${req.file.filename}`;

        await event.update({ image: imagePath });

        return res.status(200).json({
            msg: 'Image uploaded successfully',
            image: imagePath
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
}


// Tickets of event

exports.getTicketsByEvent = async (req, res) => {

    const { uuid } = req.params;
    const { page = 1, limit = 10, sort = 'createdAt', order = 'asc', status, email, name, availableTicket, include } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const includeArray = [];

    if (include) {
        const includes = include.split(',');

        includes.forEach((inc) => {
            if (inc === 'availableTicket') {
                includeArray.push(
                    {
                        model: models.AvailableTicket,
                        as: 'availableTicketDetails',
                        where: { event: uuid },
                        include: [
                            {
                                model: models.Zone,
                                as: 'zoneDetails',
                                // attributes: ['uuid', 'name']
                                required: false
                            }
                        ]
                    }
                );
            } else if (inc === 'answers') {
                includeArray.push({
                    model: models.Answer,
                    as: 'answers',
                    attributes: {
                        include: [
                            [
                                models.Sequelize.literal(`(
              SELECT f.question
              FROM forms AS f
              WHERE f.uuid = answers.form
            )`),
                                'question'
                            ]
                        ]
                    }
                });
            }
        });
    }

    try {
        const tickets = await models.Ticket.findAndCountAll({
            where: {
                ...(status ? { status } : {}),
                ...(email ? { email } : {}),
                ...(name ? { name: { [models.Sequelize.Op.like]: `%${name}%` } } : {}),
                ...(availableTicket ? { availableTicket } : {}),
                // availableTicket: {
                //     [models.Sequelize.Op.in]: models.Sequelize.literal(`(
                //         SELECT uuid FROM luistei3_campus2go.availableTickets WHERE event = '${uuid}' AND active = true
                //     )`)
                // }
            },
            include: includeArray,
            limit: parseInt(limit),
            offset,
            order: [[sort, order]],
        });

        return res.status(200).json({
            tickets: tickets.rows,
            totalItems: tickets.count,
            totalPages: Math.ceil(tickets.count / limit),
            currentPage: parseInt(page),
            itemsPerPage: parseInt(limit)
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }

}

exports.getTicketById = async (req, res) => {
    const { uuid, ticketUuid } = req.params;

    try {
        const ticket = await models.Ticket.findOne({
            where: {
                uuid: ticketUuid,
                event: uuid
            },
            include: [
                {
                    model: models.AvailableTicket,
                    as: 'availableTicketDetails',
                    include: [
                        {
                            model: models.Zone,
                            as: 'zoneDetails',
                        }
                    ]
                },
                {
                    model: models.Answer,
                    as: 'answers',
                    include: [
                        {
                            model: models.Form,
                            as: 'formDetails',
                        }
                    ]
                }
            ]
        });

        if (!ticket) {
            return res.status(404).json({ msg: 'Ticket not found' });
        }

        return res.status(200).json(ticket);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
}

exports.updateTicket = async (req, res) => {
    const { ticketUuid } = req.params;
    const { email, validated, availableTicket, name } = req.body;

    try {
        const ticket = await models.Ticket.findOne({
            where: {
                uuid: ticketUuid,
            }
        });

        if (!ticket) {
            return res.status(404).json({ msg: 'Ticket not found' });
        }

        const updatedData = {
            email,
            validated,
            availableTicket,
            name
        };

        await ticket.update(updatedData);

        return res.status(200).json({
            msg: 'Ticket updated successfully',
            ticket
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
}

exports.exportTickets = async (req, res) => {
    const { uuid } = req.params;
    const { email } = req.user;

    try {

        const tickets = await models.Ticket.findAll({
            include: [
                {
                    model: models.AvailableTicket,
                    as: 'availableTicketDetails',
                    where: { event: uuid },
                },
                {
                    model: models.Answer,
                    as: 'answers',
                    // include: [
                    //     {
                    //         model: models.Form,
                    //         as: 'formDetails',
                    //     }
                    // ]
                }
            ]
        });

        if (tickets.length === 0) {
            return res.status(404).json({ msg: 'No tickets found for this event' });
        }

        const forms = await models.Form.findAll({
            where: { event: uuid }
        });


        const data = tickets.map(ticket => {
            return {
                uuid: ticket.uuid,
                email: ticket.email,
                name: ticket.name,
                status: ticket.status,
                type: ticket.availableTicketDetails.name,
                validated: ticket.validated,
                answers: forms.length > 0 ? ticket.answers : ''
            }
        })

        if (forms.length > 0) {

            await forms.forEach(form => {
                data.forEach(ticket => {
                    ticket[form.question] = ticket.answers.find((answer) => answer.form == form.uuid)?.answer || '';
                });
            });

            await data.forEach(ticket => delete ticket.answers)

        }

        const csv = json2csv.json2csv(data);

        if (!fs.existsSync(path.join(__dirname, '..', 'temp/exports'))) {
            fs.mkdirSync(path.join(__dirname, '..', 'temp/exports'), { recursive: true });
        }

        fs.writeFileSync(path.join(__dirname, `../temp/exports/tickets_${uuid}.csv`), csv);

        const source = path.join(__dirname, `../temp/exports/tickets_${uuid}.csv`);
        const destination = path.join(__dirname, `../temp/exports/tickets_${uuid}.xlsx`);

        convertCsvToXlsx(source, destination);


        res.status(200).json({ msg: 'Tickets will sent to your email' });

        await sendEmails.sendExportTickets(uuid, email);

        fs.unlinkSync(path.join(__dirname, `../temp/exports/tickets_${uuid}.csv`));
        fs.unlinkSync(path.join(__dirname, `../temp/exports/tickets_${uuid}.xlsx`));

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });

    }
}

exports.resendTicket = async (req, res) => {

    const { ticketUuid } = req.params;

    try {

        const ticket = await models.Ticket.findOne({
            where: {
                uuid: ticketUuid,
            },
            include: [
                {
                    model: models.AvailableTicket,
                    as: 'availableTicketDetails',
                    include: [
                        {
                            model: models.Event,
                            as: 'eventDetails',
                        }
                    ]
                }
            ]
        });

        if (!ticket) {
            return res.status(404).json({ msg: 'Ticket not found' });
        }

        res.status(200).send({
            msg: 'Ticket sent'
        })

        sendEmails.resendTickets(ticket)
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }

}

// Statistics of event

exports.getEventStatistics = async (req, res) => {



}