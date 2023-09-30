//Dependencies for News Controller
const News = require("../models/news");
const Category = require("../models/category");

//All the models
const newsModel = new News();

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      success: false,
      message: "Conteúdo não pode estar vazio",
    });
    return;
  }

  const news = new News();
  news.author = req.body["author"];
  news.title = req.body["title"];
  news.content = req.body["content"];
  news.publishDate = req.body["publish-date"];
  news.contentPreview = req.body["content-preview"];
  news.imageCover = req.body["image-cover"];

  if (!news.author) {
    res.status(400).send({
      success: false,
      message: "O autor do artigo não pode estar vazio",
    });
    return;
  }

  if (!news.title) {
    res.status(400).send({
      success: false,
      message: "O título não pode estar vazio",
    });
    return;
  }

  if (!news.content) {
    res.status(400).send({
      success: false,
      message: "Conteúdo não pode estar vazio",
    });
    return;
  }

  if (!req.body["category"]) {
    res.status(400).send({
      success: false,
      message: "A categoria não pode estar vazia",
    });
    return;
  } else {
    const newsM = newsModel.getCategoryById(req.body["category"]);

    if (!newsM) {
      res.status(404).send({
        success: false,
        message: "O Id da Categoria não foi encontrado",
      });
      return;
    } else {
      news.category = new Category(newsM.id, newsM.name);
    }
  }

  if (!news.contentPreview) {
    res.status(400).send({
      success: false,
      message: "A prévia do conteúdo não pode estar vazia",
    });
    return;
  }

  if (!news.publishDate) {
    res.status(400).send({
      success: false,
      message: "A data de publicação não pode estar vazia",
    });
    return;
  }

  if (!news.imageCover) {
    res.status(400).send({
      success: false,
      message: "A imagem de capa não pode estar vazia",
    });
    return;
  }

  console.log("Notícia Salva: ", news);

  res.status(200).json({
    success: true,
    message: "A notícia foi salva com sucesso!",
  });
};
