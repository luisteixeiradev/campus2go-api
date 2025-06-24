const models = require('../models');

exports.getAllAvailableTickets = async (req, res) => {
    try {
        const { include, active } = req.query; // Extracting query parameters

        const includeArray = []; // Array to hold the includes for Sequelize

        if (include) {
            const includes = include.split(','); // Splitting the include string into an array

            includes.forEach((inc) => {
                if (inc === 'zone') {
                    includeArray.push({
                        model: models.Zone,
                        as: 'zoneDetails',
                        required: false
                    });
                }
            });
        }

        const whereClause = {
            event: req.params.id,
        }

        // If active is provided, add it to the where clause
        if (active) {
            whereClause.active = active === 'true' ? true : false; // Convert string to boolean
        }

        // Fetching available tickets with pagination and includes
        const availableTickets = await models.AvailableTicket.findAll({
            where: whereClause,
            include: includeArray
        });

        return res.status(200).json({
            availableTickets: availableTickets
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: "Error when fetching available tickets"
        });
    }

}

exports.createAvailableTicket = async (req, res) => {

    try {
        const { id } = req.params; // Event ID from the route parameters
        const { name, price, max, zone } = req.body; // Extracting data from the request body

        const json = {
            name,
            price,
            max,
            event: id // Associate with the event using its ID
        };

        // Check if zone is zone of space event
        if (zone) {
            // Check if the zone belongs to the event's space
            const event = await models.Event.findOne({
                where: { uuid: id },
                include: [{
                    model: models.Space,
                    as: 'spaceDetails',
                    include: [{
                        model: models.Zone,
                        as: 'zones',
                        where: { uuid: zone } // Check if the zone matches
                    }]
                }]
            });

            if (event.spaceDetails.zones.length === 0) {
                res.status(400).send({ error: "Zone does not belong to the event's space" })
            }

            json.zone = zone;
        }


        // If a zone is provided, add it to the JSON object
        // if (zone) {
        //     json.zone = zone;
        // }

        // Create a new available ticket associated with the event
        const availableTicket = await models.AvailableTicket.create(json);

        return res.status(201).send({
            msg: "Available ticket created successfully",
            availableTicket
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: "Error when creating available ticket"
        });
    }

}

exports.getAvailableTicketById = async (req, res) => {
    try {
        const { uuidAvailableTicket } = req.params; // Extracting the available ticket ID from the route parameters
        const { include } = req.query; // Extracting query parameters

        const includeArray = []; // Array to hold the includes for Sequelize

        if (include) {
            const includes = include.split(','); // Splitting the include string into an array

            includes.forEach((inc) => {
                if (inc === 'zone') {
                    includeArray.push({
                        model: models.Zone,
                        as: 'zoneDetails',
                        required: false
                    });
                }
            });
        }

        // Fetching the available ticket by ID with includes
        const availableTicket = await models.AvailableTicket.findOne({
            where: { uuid: uuidAvailableTicket },
            include: includeArray
        });

        if (!availableTicket) {
            return res.status(404).json({ msg: 'Available ticket not found' });
        }

        return res.status(200).json({availableTicket});
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: "Error when fetching available ticket"
        });
    }
}

exports.updateAvailableTicket = async (req, res) => {
    try {
        const { uuidAvailableTicket } = req.params; // Extracting the available ticket ID from the route parameters
        const { name, price, max, zone } = req.body; // Extracting data from the request body

        const json = {};

        if (name) json.name = name;
        if (price) json.price = price;
        if (max) json.max = max;
        if (zone) json.zone = zone;

        // Updating the available ticket
        const [updated] = await models.AvailableTicket.update(json, {
            where: { uuid: uuidAvailableTicket }
        });

        if (!updated) {
            return res.status(404).json({ msg: 'Available ticket not found' });
        }

        return res.status(200).json({ msg: 'Available ticket updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: "Error when updating available ticket"
        });
    }
}

exports.deleteAvailableTicket = async (req, res) => {
    try {
        const { uuidAvailableTicket } = req.params; 

        const availableTicket = await models.AvailableTicket.findOne({
            where: {
                uuid: uuidAvailableTicket,
            },
            include: [
                {
                    model: models.Ticket,
                    as: 'tickets',
                    required: false
                }
            ]
        });

        if (!availableTicket) {
            return res.status(404).json({ error: 'Available ticket not found' });
        }

        
        if (availableTicket.tickets.length > 0) {
            return res.status(400).json({ error: 'Cannot delete available ticket with associated tickets' });
        }

        return res.status(200).json({ msg: 'Available ticket deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: "Error when deleting available ticket"
        });
    }
}