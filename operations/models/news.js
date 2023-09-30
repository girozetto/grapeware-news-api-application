const Category = require("./category");

const categories = [];

categories.push(new Category("1a", "Política").toObjectNotation());
categories.push(new Category("2a", "Economia").toObjectNotation());
categories.push(new Category("3a", "Mundo").toObjectNotation());
categories.push(new Category("4a", "Local").toObjectNotation());
categories.push(new Category("5a", "Tecnologia").toObjectNotation());
categories.push(new Category("6a", "Ciência").toObjectNotation());
categories.push(new Category("7a", "Meio Ambiente").toObjectNotation());
categories.push(
  new Category("8a", "Cultura e Entretenimento").toObjectNotation()
);
categories.push(new Category("9a", "Esportes").toObjectNotation());
categories.push(new Category("10a", "Saúde").toObjectNotation());
categories.push(new Category("11a", "Educação").toObjectNotation());
categories.push(new Category("12a", "Crime e Justiça").toObjectNotation());
categories.push(new Category("13a", "Estilo de Vida").toObjectNotation());
categories.push(new Category("14a", "Opinião e Editorial").toObjectNotation());
categories.push(new Category("15a", "Religião").toObjectNotation());
categories.push(
  new Category("16a", "Tendências e Inovação").toObjectNotation()
);
categories.push(new Category("17a", "HQs e Animações").toObjectNotation());
categories.push(
  new Category("15a", "Literatura e Lançamento de Livros").toObjectNotation()
);

class News {
  constructor() {
    this.id = "";
    this.title = "";
    this.author = "";
    this.content = "";
    this.contentPreview = "";
    this.imageCover = {};
    this.publishDate = "";
    this.category = new Category();
  }

  getCategories() {
    return categories;
  }
  getCategoryById(id = "") {
    let cat;
    categories.forEach((category) => {
      if (category.id == id) cat = category;
    });
    return cat;
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
      "image-cover": this.imageCover,
    };
  }
}

module.exports = News;
