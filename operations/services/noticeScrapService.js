const axios = require("axios");
const cheerio = require("cheerio");
const dateConverter = require("../converters/dateConverters");
const News = require("../models/news");

const scrapeHealthyNews = async () => {
  const pageUrl = "https://minsa.gov.ao/ao/noticias/";
  const { data } = await axios.get(pageUrl);
  const $ = cheerio.load(data);
  let noticias = [];

  const dataMaisRecenteNaBase = await News.getLatestNewsDate();

  for (let element of $(".box-noticias .item")) {
    const titulo = $(element).find("h2").text().trim();
    const textoData = $(element).find(".data").text().trim();
    const dataPublicacao = dateConverter.convertDate(textoData);
    const link = pageUrl + $(element).find("a").attr("href");
    const conteudoPreview = $(element).find("p").text().trim();

    const noticiaExistente = await News.getByTitle(titulo);

    if (!noticiaExistente && dataPublicacao > dataMaisRecenteNaBase) {
      const { imageCoverUrl, content } = await scrapeNewsDetails(link);

      noticias.push({
        titulo,
        link,
        conteudoPreview,
        dataPublicacao,
        imageCoverUrl,
        content,
      });
    }
  }

  return noticias.sort((a, b) => a.dataPublicacao - b.dataPublicacao);
};

const scrapeNewsDetails = async (newsUrl) => {
  try {
    const { data } = await axios.get(newsUrl);
    const $ = cheerio.load(data);

    const imageCoverUrl = $("div.cover img").attr("src");
    const content = $("div.container.small-container").text().trim();

    return { imageCoverUrl, content };
  } catch (error) {
    console.error(`Erro ao fazer scraping da notícia: ${newsUrl}`, error);
    return {};
  }
};

module.exports = { scrapeHealthyNews };
