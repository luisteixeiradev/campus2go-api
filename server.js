const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(express.json());
app.use(cors());

const models = require('./models');
models.sequelize
    .sync({ alter: true })
    .then(() => console.log("Base de dados sincronizada!"))
    .catch((err) => console.error("Erro ao sincronizar BD:", err));

app.use(require('./routes/index'));

app.get('/', (req, res) => {

    res.send('Welcome to the API');

});

app.listen(process.env.PORT, () => {

    console.log(`Server is running on port ${process.env.PORT}`);
});