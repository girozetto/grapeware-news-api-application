const postgres = require("postgres");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const config = {
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: "require",
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
};

let sqlInstance = postgres(config);
let refCount = 0;

//Evento quando o processo encerrar
process.on("beforeExit", async (e) => {
  console.log("Terminando a aplicacao");
  await closeConnection();
});

// Obtém a versão do PostgreSQL
const getPgVersion = async () => {
  try {
    const sql = await getSqlConnection();
    const result = await sql`SELECT version()`;
    console.log("Versão do PostgreSQL:", result[0].version);
  } catch (err) {
    console.error("Erro ao obter a versão do PostgreSQL:", err);
  } finally {
    await closeConnection();
  }
};

// Função para criar a tabela de categorias
const createCategoriesTable = async () => {
  try {
    const sql = await getSqlConnection();
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE
      );
    `;

    console.log("Tabela 'categories' criada com sucesso!");
  } catch (err) {
    console.error("Erro ao criar a tabela 'categories':", err);
  } finally {
    await closeConnection();
  }
};

const migrateDefaultCategories = async () => {
  try {
    const categoriesArray = [
      "Esportes",
      "Tecnologia",
      "Política",
      "Economia",
      "Mundo",
      "Local",
      "Ciência",
      "Meio Ambiente",
      "Saúde",
      "Educação",
      "Crime e Justiça",
      "Estilo de Vida",
      "Opinião e Editorial",
      "Religião",
      "Tendências e Inovação",
      "HQs e Animações",
      "Literatura e Lançamento de Livros",
      "Cultura e Entretenimento",
    ];

    const sql = await getSqlConnection();
    for (const name of categoriesArray) {
      await sql`
        INSERT INTO categories (id, name) VALUES
        (${uuidv4()},${name})
        ON CONFLICT (name) DO NOTHING;
      `;
    }
  } catch (error) {
    console.log("Erro ao introduzir as categorias", error);
  } finally {
    await closeConnection();
  }
};

// Função para remover a tabela se ela existir
const dropExistingTables = async (tableName) => {
  try {
    const sql = await getSqlConnection();
    await sql`DROP TABLE IF EXISTS ${tableName};`;
    console.log(`Tabela '${tableName}' removida com sucesso!`);
  } catch (err) {
    console.error(`Erro ao remover a tabela '${tableName}':`, err);
  } finally {
    await closeConnection();
  }
};



const createNewsTable = async () => {
  try {
    const sql = await getSqlConnection();
    await sql`
      CREATE TABLE IF NOT EXISTS news (
        id UUID PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(100) NOT NULL,
        content TEXT NOT NULL,
        content_preview TEXT,
        image_cover_url VARCHAR(255),
        image_cover_base64 TEXT,
        publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        category_id UUID REFERENCES categories(id)
      );
    `;
    console.log("Tabela 'news' criada com sucesso!");
  } catch (err) {
    console.error("Erro ao criar a tabela 'news':", err);
  } finally {
    await closeConnection();
  }
};

// Função para executar todas as migrações
const runMigrations = async () => {
  await tableExistence(
    "categories",
    async () => {
      console.log("Tabela 'categories' Carregadas");
    },
    async () => {
      console.log("Criando a tabela 'categories'.");
      await createCategoriesTable();
      await migrateDefaultCategories();
    }
  );

  await tableExistence(
    "news",
    async () => {
      console.log("Tabela 'news' Carregadas");
    },
    async () => {
      console.log("Criando a tabela 'news'.");
      await createNewsTable();
    }
  );
  // Adicione outras funções de criação de tabela aqui
};

const tableExistence = async (tableName, exists, notexists) => {
  const schemaName = "public"; // ou o esquema que você está usando
  try {
    const sql = await getSqlConnection();
    const result = await sql`SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE  table_schema = ${schemaName}
    AND    table_name   = ${tableName}
    );`;

    if (result[0].exists) {
      console.log(`A tabela ${tableName} existe.`);
      exists();
    } else {
      notexists();
    }
  } catch (e) {
    console.error("Falha na conexão:", err);
  } finally {
    await closeConnection();
  }
};

const getSqlConnection = async () => {
  if (sqlInstance === null) {
    sqlInstance = postgres(config);
  }
  refCount++;
  return sqlInstance;
};

// Verifica a conexão
const checkConnection = async () => {
  try {
    const sql = await getSqlConnection();
    await sql`SELECT 1`;
    await runMigrations();
  } catch (err) {
    sqlInstance = null;
    await checkConnection();
    console.error("Falha na conexão:", err);
  } finally {
    await closeConnection();
  }
};

//Fechar conexão a base de dados
const closeConnection = async () => {
  /*refCount--;
  if (refCount <= 0 && sqlInstance !== null) {
    await sqlInstance.end();
    sqlInstance = null;
  }*/
};

// Exporta as funções e a conexão
module.exports = {
  dropExistingTables,
  runMigrations,
  checkConnection,
  getPgVersion,
  closeConnection,
  migrateDefaultCategories,
  getSqlConnection
};
