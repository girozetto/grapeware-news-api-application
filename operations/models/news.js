const Category = require("./category");
const {
  checkConnection,
  closeConnection,
  getSqlConnection,
} = require("./database");
const { v4: uuidv4 } = require("uuid");

checkConnection();

class News {
  constructor() {
    this.id = "";
    this.title = "";
    this.author = "";
    this.content = "";
    this.contentPreview = "";
    this.imageCoverUrl = "";
    this.imageCoverBase64 = "";
    this.publishDate = "";
    this.category = new Category();
  }

  static async create(newsObj) {
    try {
      const {
        title,
        author,
        content,
        contentPreview,
        imageCoverUrl,
        imageCoverBase64,
        publishDate,
        category,
      } = newsObj;
      const id = uuidv4();
      const connection = await getSqlConnection();
      const result = await connection`
        INSERT INTO news (id,title, author, content, content_preview, image_cover_url, image_cover_base64, publish_date, category_id)
        VALUES (${id},${title}, ${author}, ${content}, ${contentPreview}, ${imageCoverUrl}, ${imageCoverBase64}, ${publishDate}, ${category.id})
        RETURNING id;
      `;

      return result[0].id; // Retorna o ID da notícia recém-criada
    } catch (err) {
      console.error("Erro ao criar notícia:", err);
      return null;
    } finally {
      await closeConnection();
    }
  }

  static async getById(id) {
    try {
      const connection = await getSqlConnection();
      const news = await connection`SELECT * FROM news WHERE id = ${id}`;
      if (news.length > 0) {
        return new News().fromObject(news[0]);
      }
      return null;
    } catch (err) {
      console.error(`Erro ao buscar notícia com ID ${id}:`, err);
      return null;
    } finally {
      await closeConnection();
    }
  }

  static async getLatest(limit = 5, category_name = "") {
    try {
      const connection = await getSqlConnection();
      if (category_name === "") {
        let news = await connection`SELECT * 
      FROM news 
      ORDER BY publish_date DESC LIMIT ${limit}`;
        return news.map((n) => new News().fromObject(n));
      }

      let news = await connection`SELECT news.* 
      FROM news 
      JOIN categories ON news.category_id = categories.id WHERE categories.name = ${category_name} ORDER BY news.publish_date DESC LIMIT ${limit}`;
      return news.map((n) => new News().fromObject(n));
    } catch (err) {
      console.error("Erro ao buscar as notícias mais recentes:", err);
      throw new Error("Erro ao buscar as notícias mais recentes");
    } finally {
      await closeConnection();
    }
  }

  static async countTotalNews(category_name = "") {
    try {
      const connection = await getSqlConnection();

      if (category_name === "") {
        const result = await connection`SELECT COUNT(*) 
      FROM news`;
        return parseInt(result[0].count);
      }

      const result = await connection`SELECT COUNT(*) 
      FROM news 
      JOIN categories ON news.category_id = categories.id WHERE categories.name = ${category_name}`;
      return parseInt(result[0].count);
    } catch (error) {
      throw new Error("Erro ao contar o número total de notícias");
    } finally {
      await closeConnection();
    }
  }

  static async getByPage(page = 1, pageSize = 10, category_name = "") {
    const offset = (page - 1) * pageSize;
    try {
      const connection = await getSqlConnection();
      if (category_name == "") {
        const news = await connection`SELECT * 
      FROM news 
      ORDER BY publish_date DESC LIMIT ${pageSize} OFFSET ${offset}`;
        return news.map((n) => new News().fromObject(n));
      }
      const news = await connection`SELECT news.* 
      FROM news 
      JOIN categories ON news.category_id = categories.id WHERE categories.name = ${category_name} ORDER BY news.publish_date DESC LIMIT ${pageSize} OFFSET ${offset}`;
      return news.map((n) => new News().fromObject(n));
    } catch (err) {
      console.error("Erro ao buscar notícias por página:", err);
      throw new Error("Erro ao contar o número total de notícias");
    } finally {
      await closeConnection();
    }
  }

  fromObject(obj) {
    this.id = obj.id;
    this.title = obj.title;
    this.author = obj.author;
    this.content = obj.content;
    this.contentPreview = obj.content_preview;
    this.imageCoverUrl = obj.image_cover_url;
    this.imageCoverBase64 = obj.image_cover_base64;
    this.publishDate = obj.publish_date;
    this.category = new Category(obj.category_id, ""); // Supondo que category_id esteja disponível
    return this;
  }

  toObjectNotation() {
    return {
      id: this.id,
      title: this.title,
      author: this.author,
      "publish-date": this.publishDate,
      "content-preview": this.contentPreview,
      content: this.content,
      category: this.category,
      "image-cover-base64": this.imageCoverBase64,
      "image-cover-url": this.imageCoverUrl,
    };
  }
}

module.exports = News;
