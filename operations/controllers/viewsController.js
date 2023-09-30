//Dependencies for View Controller
const News = require("../models/news");
const Category = require("../models/category");

//All the models
const news = new News();
const categories = news.getCategories();

/**
 *
 * Controller for the news creator screen
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 */
exports.viewCreator = (req, res) => {
  res.render("contentCreatorView", { categories: categories });
};
