//Dependencies for News Controller
const News = require("../models/news");
const Category = require("../models/category");
const NoticeScrapService = require("../services/noticeScrapService");

//All the models
const newsModel = new News();

exports.create = async (req, res) => {
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
  news.imageCoverUrl = req.body["image-cover"]["url-link"];
  news.imageCoverBase64 = req.body["image-cover"]["url-base64"];

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
    const newsM = await Category.getById(req.body["category"]);

    if (!newsM) {
      res.status(404).send({
        success: false,
        message: "O Id da Categoria não foi encontrado",
      });
      return;
    } else {
      news.category = newsM;
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

  if (!news.imageCoverBase64 && !news.imageCoverUrl) {
    res.status(400).send({
      success: false,
      message: "A imagem de capa não pode estar vazia",
    });
    return;
  }

  try {
    await News.create(news);
    res.status(200).json({
      success: true,
      message: "A notícia foi salva com sucesso!",
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Houve um erro no servidor!",
    });
  }
};

exports.getLatestNews = async (req, res) => {
  const limit = req.query.limit || 5;
  const category = req.query.category || "Saúde"; //Saúde é o padrão de categoria

  try {
    const news = await News.getLatest(limit, category);
    res.status(200).json(news);
  } catch (e) {
    res.status(500).json({ error: "Erro ao buscar Notícia Actualizadas" });
  }
};

exports.getNewsByPage = async (req, res) => {
  const pageNumber = req.params.pageNumber;
  const pageSize = req.query.pageSize || 10; // tamanho da página padrão é 10
  const category = req.query.category || "";

  try {
    const news = await News.getByPage(pageNumber, pageSize, category);
    const totalNews = await News.countTotalNews(category);
    const totalPages = Math.ceil(totalNews / pageSize);
    res.status(200).json({
      news: news,
      pagination: {
        currentPage: pageNumber,
        pageSize: pageSize,
        totalNews: totalNews,
        totalPages: totalPages,
      },
    });
  } catch (e) {
    res.status(500).json({ error: "Erro ao buscar Notícia por Página" });
  }
};

exports.getNewsById = async (req, res) => {
  try {
    const news = await News.getById(req.params.id);
    if (news) {
      res.status(200).json(news);
    } else {
      res.status(404).json({ error: "Notícia não encontrada" });
    }
  } catch (e) {
    res.status(500).json({ error: "Erro ao buscar Notícia" });
  }
};

exports.updateHealthyNews = async (req, res) => {
  try {
    const newHealthyNews = await NoticeScrapService.scrapeHealthyNews();

    if (newHealthyNews.length > 0) {
      for (const item of newHealthyNews) {
        const news = new News();
        news.author = "Ministério da Saúde";
        news.title = item.titulo;
        news.content = item.content;
        news.publishDate = item.dataPublicacao;
        news.contentPreview = item.conteudoPreview;
        news.imageCoverUrl = item.imageCoverUrl;
        news.imageCoverBase64 = "";
        const category = await Category.getByName("Saúde");
        news.category = category;
        await News.create(news);
      }
      res.status(200).json(newHealthyNews);
    } else {
      res.status(404).json({ error: "Nenhuma nova notícia encontrada" });
    }
  } catch (e) {
    res.status(500).json({
      error: "Erro ao actualizar as notícias para novas",
      exception: e,
    });
  }
};
