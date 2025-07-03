const express = require('express');
const app = express();
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

app.use(express.json());
app.use(express.static('public'));
app.use(cors());

const models = require('./models');
models.sequelize
    // .sync({ alter: true, force: true })
    .sync()
    .then(() => console.log("Base de dados sincronizada!"))
    .catch((err) => console.error("Erro ao sincronizar BD:", err));

app.use(require('./routes/index'));
app.set('socketio', io);

// require('./utils/sessionCleaner') // Importando o limpador de sessões expiradas

app.get('/', (req, res) => {

    res.send('Welcome to the API');

});

server.listen(process.env.PORT, () => {

    console.log(`Server is running on port ${process.env.PORT}`);
});