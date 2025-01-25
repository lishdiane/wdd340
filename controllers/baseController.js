const utilities = require("../utilities/");
const baseController = {};

baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav();
  res.render("index", { title: "Home", nav });
};

baseController.error = async function(req, res) {
  //const nav = await utilities.getNav();
  throw new Error(500)
  //res.render("index", { title: "Home", nav });
};

module.exports = baseController;
