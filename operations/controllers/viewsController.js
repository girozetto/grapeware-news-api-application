//Dependencies for View Controller
const News = require("../models/news");
const Category = require("../models/category");

//All the models


/**
 *
 * Controller for the news creator screen
 *
 * @param {*} req - The request object
 * @param {*} res - The response object
 */
exports.viewCreator = async (req, res) => {
  const categories = await Category.getAll()
  res.render("contentCreatorView", { categories:  categories});
};
