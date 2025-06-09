const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = require("./user")(sequelize, DataTypes);
const Promoter = require("./promoter")(sequelize, DataTypes);
const UsersHasPromoters = require("./users_has_promoters")(sequelize, DataTypes);
const Space = require("./space")(sequelize, DataTypes);
const Zone = require("./zone")(sequelize, DataTypes);
const Event = require("./event")(sequelize, DataTypes);
const AvailableTicket = require("./availableTicket")(sequelize, DataTypes);
const Form = require("./form")(sequelize, DataTypes);

// const SessionsHasTickets = require("./sessions_has_tickets")(sequelize, DataTypes);
const Ticket = require("./ticket")(sequelize, DataTypes);
const Purchase = require("./purchase")(sequelize, DataTypes);
const Answer = require("./answer")(sequelize, DataTypes);
const Payment = require("./payment")(sequelize, DataTypes);
// const Session = require("./session")(sequelize, DataTypes);

const models = { User, Promoter, UsersHasPromoters, Space, Zone, Event, AvailableTicket, Form, Ticket, Purchase, Answer, Payment };

Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;