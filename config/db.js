const  Sequelize  = require("sequelize");

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: "mysql",
});

// async function testConnection() {
//   try {
//     await sequelize.authenticate();
//     console.log("✅ Conexão com MySQL estabelecida com sucesso!");
//   } catch (error) {
//     console.error("❌ Erro ao conectar ao MySQL:", error);
//   }
// }

// testConnection();

module.exports = sequelize;