const { getSqlConnection, closeConnection } = require("./database");
//const { getSqlConnection, closeConnection } = require("./db_mysql");

class Category {
  constructor(id = "", name = "") {
    this.id = id;
    this.name = name;
  }

  static async getAll() {
    try {
      const connection = await getSqlConnection();
      const categories = await connection`SELECT * FROM categories`;
      return categories.map((cat) => new Category(cat.id, cat.name));
    } catch (err) {
      console.error("Erro ao buscar todas as categorias:", err);
      return [];
    }finally {
      await closeConnection();
    }
  }

  static async getById(id) {
    try {
      const connection = await getSqlConnection();
      const category = await connection`SELECT * FROM categories WHERE id = ${id}`;
      if (category.length > 0) {
        return new Category(category[0].id, category[0].name);
      }
      return null;
    } catch (err) {
      console.error(`Erro ao buscar a categoria com ID ${id}:`, err);
      return null;
    }
    finally {
      await closeConnection();
    }
  }

  static async getByName(name) {
    try {
      const connection = await getSqlConnection();
      const category = await connection`SELECT * FROM categories WHERE name = ${name}`;
      if (category.length > 0) {
        return new Category(category[0].id, category[0].name);
      }
      return null;
    } catch (err) {
      console.error(`Erro ao buscar a categoria com nome ${name}:`, err);
      return null;
    }
    finally {
      await closeConnection();
    }
  }

  toObjectNotation() {
    return {
      id: this.id,
      name: this.name,
    };
  }
}

console.log(Category.getAll());

module.exports = Category;
