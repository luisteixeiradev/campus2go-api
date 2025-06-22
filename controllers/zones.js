const models = require('../models');

exports.getAllZones = async (req, res) => {

    const { uuid } = req.params;

    try {
        const zones = await models.Zone.findAll({
            where: {
                space: uuid
            },
        });

        return res.status(200).send({
            zones
        });
    } catch (error) {
        console.log(error);

        return res.status(500).send({
            error: "error when retrieving zones"
        });
    }

}

exports.createZone = async (req, res) => {
    try {

        const { uuid } = req.params;
        console.log(uuid);

        const { name, capacity } = req.body;

        const zone = await models.Zone.create({
            name,
            capacity,
            space: uuid
        });

        return res.status(201).send({
            msg: "zone created",
            zone
        });
    } catch (error) {
        console.log(error);

        return res.status(500).send({
            error: "error when creating zone"
        });
    }
}

exports.getZoneById = async (req, res) => {
    const { uuidZone, uuid } = req.params;

    try {
        const zone = await models.Zone.findOne({
            where: {
                uuid: uuidZone,
                space: uuid
            },
        });

        if (!zone) {
            return res.status(404).json({ msg: 'Zone not found' });
        }

        return res.status(200).json({zone});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
}

exports.updateZone = async (req, res) => {

    const { uuidZone, uuid } = req.params;
    const { name, capacity } = req.body;

    try {
        const zone = await models.Zone.findOne({
            where: {
                uuid: uuidZone,
                space: uuid
            },
        });

        if (!zone) {
            return res.status(404).json({ msg: 'Zone not found' });
        }

        zone.name = name || zone.name;
        zone.capacity = capacity || zone.capacity;

        await zone.save();

        return res.status(200).json({ msg: 'Zone updated successfully', zone });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }

}