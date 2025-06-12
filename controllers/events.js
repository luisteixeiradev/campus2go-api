const { where } = require('sequelize');
const models = require('../models');

exports.getAllEvents = async (req, res) => {

    const { page = 1, limit = 10, startDate, endDate, name, active, include, sort = "startDate", order = "asc", promoter } = req.query;

    const offset = (page - 1) * limit;


    const whereClause = {};

    if (active) {
        whereClause.active = active === 'true' ? true : false
    }

    if (startDate) {
        whereClause.startDate = {
            [models.Sequelize.Op.gte]: new Date(startDate)
        };
    }

    if (endDate) {
        whereClause.endDate = {
            [models.Sequelize.Op.lte]: new Date(endDate)
        };
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
            limit,
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
    const { id } = req.params;
    const { include, availableTickets='true' } = req.query;

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
                    where: { active: availableTickets == 'true'? true : false },
                    required: false,
                    attributes: ['uuid', 'name', 'price', 'max'],
                    include: [
                        {
                            model: models.Zone,
                            as: 'zoneDetails',
                            attributes: ['uuid', 'name']
                        }
                    ]
                });
                }
            });
        }

        const event = await models.Event.findOne({
            where: {
                uuid: id
            },
            include: includeArray,
        });

        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        return res.status(200).json(event);
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
    const { id } = req.params;
    const { name, description, startDate, endDate, promoter, space, active } = req.body;

    try {
        const event = await models.Event.findOne({
            where: {
                uuid: id,
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
    const { id } = req.params;

    try {
        const event = await models.Event.findOne({
            where: {
                uuid: id,
                ...(req.user.role === 'promoter' ? { promoter: req.promoter.uuid } : {})
            }
        });

        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        await event.destroy();

        return res.status(200).json({ msg: 'Event deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
}