const models = require('../models');

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
                        attributes: ['uuid', 'name', 'vat', 'address', 'email', 'phone']
                    });
                } else if (inc === 'space') {
                    includeArray.push({
                        model: models.Space,
                        as: 'spaceDetails',
                        attributes: ['uuid', 'name', 'address'],

                    });
                } else if (inc === 'availableTickets') {
                    includeArray.push({
                        model: models.AvailableTicket,
                        as: 'availableTickets',
                        where: { active: availableTickets == 'true' ? true : false },
                        required: false,
                        attributes: ['uuid', 'name', 'price', 'capacity', 'active'],
                        include: [
                            {
                                model: models.Zone,
                                as: 'zoneDetails',
                                attributes: ['uuid', 'name', 'space', 'capacity'],
                            }
                        ]
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
                        // where: { event: uuid },
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
    const { uuid, ticketUuid } = req.params;
    const { status, email, validated, availableTicket, name } = req.body;

    try {
        const ticket = await models.Ticket.findOne({
            where: {
                uuid: ticketUuid,
                event: uuid
            }
        });

        if (!ticket) {
            return res.status(404).json({ msg: 'Ticket not found' });
        }

        const updatedData = {
            status,
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


// Statistics of event

exports.getEventStatistics = async (req, res) => {



}