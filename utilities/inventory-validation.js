const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};
const invModel = require("../models/inventory-model")

// Add New Classification Rules

validate.classificationRules = () => {
  return [
    //classification name must be only letters
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name.")
      .isAlpha()
      .withMessage("Classification must only be Alphabetic characters.")
  ];
};

//Check data and return errors or continue to add new classification

validate.checkClassificationData = async (req, res, next) => {
  const {classification_name} = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

// Add New Inventory Rules

validate.inventoryRules = () => {
  return [

    //classification must not be empty
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please select a classification."),
    
    //Make is required and must be a string
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide the make of the vehicle. Min 3 characters."),

    //Model is required and must be a string
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide the model of the vehicle. Min 3 characters."),

    //Description is required
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a description of the vehicle."),

    //image is required
    body("inv_image")
      .trim()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a full sized image path of the vehicle."),

    //image thumbnail is required
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a thumbnail image path of the vehicle."),

    //price is required and must be an integer or a decimal
    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isCurrency()
      .withMessage("Price must be formatted as an integer or a decimal."),

    // Year is required and must be a 4 digit number
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .matches(/18[0-9]{2}|19[0-9]{2}|20[0-9]{2}/)
      .withMessage("Year must be a valid 4 digit number"),

    // Miles is required and must be a number
    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please enter the vehicle's total miles.")
      .isNumeric()
      .withMessage("Miles must be a number only"),

    // Color is required and must be a string
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .isLength({min: 1})
      .withMessage("Please enter the color of the vehicle.")
  ];
};

//Check data and return errors or continue to add new Inventory

validate.checkInventoryData = async (req, res, next) => {
  const {classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color} = req.body;
  const options = await utilities.getOptions(classification_id);
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Inventory",
      options: options,
      nav,
      classification_id,
      inv_make, 
      inv_model, 
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_year, 
      inv_miles, 
      inv_color,
    });
    return;
  }
  next();
};

//Check data and return errors or continue to Edit Inventory view
validate.checkUpdateData = async (req, res, next) => {
  const {inv_id, classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color} = req.body;
  const options = await utilities.getOptions(classification_id);
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/edit-inventory", {
      errors,
      title: `Edit ${inv_make} ${inv_model}`,
      options: options,
      nav,
      inv_id,
      classification_id,
      inv_make, 
      inv_model, 
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_year, 
      inv_miles, 
      inv_color,
    });
    return;
  }
  next();
};

//validate review form rules

validate.reviewRules = () => {
  return [
    //classification name must be only letters
    body("review_rating")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("A rating must be set."),
    
    //textare must not be empty
    body("review_text")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Please enter a review for the vehicle."),

  ];
};

//Check data and return errors or continue to add new classification

validate.checkReviewData = async (req, res, next) => {
  const {review_rating, review_text, account_id, inv_id} = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const invData = await invModel.getInventoryDetails(parseInt(inv_id))
    const reviewData = await invModel.getReviewByInvId(parseInt(inv_id))
    const list = await utilities.buildReviewList(reviewData)
    res.render("inventory/review", {
      errors,
      title: `${invData[0].inv_year} ${invData[0].inv_make} ${invData[0].inv_model} Reviews`,
      nav,
      review: list,
      review_rating,
      review_text,
      account_id,
      inv_id,
    });
    return;
  }
  next();
}; 

module.exports = validate;
