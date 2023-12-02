const mysql = require('mysql2/promise');
require('dotenv').config();

// Carregar variáveis de ambiente
let { MYSQLHOST, MYSQLDATABASE, MYSQLUSER, MYSQLPASSWORD, MYSQLPORT } = process.env;

// Configurações do banco de dados
const config = {
  host: MYSQLHOST,
  database: MYSQLDATABASE,
  user: MYSQLUSER,
  password: MYSQLPASSWORD,
  port: MYSQLPORT,
};

let connection = mysql.createConnection(`mysql://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`);
let refCount = 0;

// Evento para fechar a conexão quando o processo encerrar
process.on('beforeExit', async () => {
  console.log('Terminando a aplicação');
  await closeConnection();
});

// Obter conexão com o banco de dados
const getSqlConnection = async () => {
  if (!connection) {
    connection = await mysql.createConnection(config);
  }
  refCount++;
  return connection;
};

// Fechar conexão com o banco de dados
const closeConnection = async () => {
  refCount--;
  if (refCount <= 0 && connection) {
    (await connection).end();
    connection = null;
  }
};

const runMigrations = async () => {
    const connection = await getSqlConnection();
    try {
      await connection.query('CREATE TABLE IF NOT EXISTS categories (id CHAR(36) PRIMARY KEY, name VARCHAR(50) NOT NULL UNIQUE);');
      console.log("Tabela 'categories' criada com sucesso!");
    } catch (err) {
      console.error("Erro ao criar a tabela 'categories':", err);
    } finally {
      await closeConnection();
    }
  };

// Exportar funções
module.exports = {
  getSqlConnection,
  closeConnection
};