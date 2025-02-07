const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */

invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " Vehicles",
    nav,
    grid,
  });
};

// Build Inventory Details View
invCont.buildByInventoryId = async function (req, res, next) {
  const invId = req.params.invId;
  const data = await invModel.getInventoryDetails(invId);
  const details = await utilities.buildDetails(data);
  let nav = await utilities.getNav();
  const vehicleName = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`;
  res.render("./inventory/details", {
    title: vehicleName,
    nav,
    details,
  });
};

/* ***************************
 *  Management views
 * ************************** */

//Build Management View
invCont.buildManagement = async function (req, res, next) {
  const nav = await utilities.getNav();
  const options = await utilities.getOptions();
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    options,
    errors: null,
  });
};

//Build Add New Classification view
invCont.buildAddClassification = async function (req, res, next) {
  const nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  });
};

//Build Add New Inventory view
invCont.buildAddInventory = async function (req, res, next) {
  const nav = await utilities.getNav();
  const options = await utilities.getOptions();
  res.render("inventory/add-inventory", {
    title: "Add New Inventory",
    options: options,
    nav,
    errors: null,
  });
};


/* ***************************
 *  Management Processing
 * ************************** */

//Process Add New Classification
invCont.addNewClassification = async function (req, res) {
  let nav = await utilities.getNav();
  const options = await utilities.getOptions();
  const { classification_name } = req.body;

  const classificationResult = await invModel.addNewClassification(
    classification_name
  );

  if (classificationResult) {
    nav = await utilities.getNav();
    req.flash(
      "notice",
      `The classification ${classification_name} was successfully added.`
    );
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      errors: null,
      options: options,
    });
  } else {
    const nav = await utilities.getNav();
    req.flash("notice", "Sorry, failed to add new classification.");
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    });
  }
};

//Process Add New Inventory
invCont.addNewInventory = async function (req, res) {
  let nav = await utilities.getNav();
  const {
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
  } = req.body;

  const inventoryResult = await invModel.addNewInventory(
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  );

  if (inventoryResult) {
    req.flash(
      "notice",
      `${inv_year} ${inv_make} ${inv_model} was successfully added.`
    );
    const options = await utilities.getOptions();
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      errors: null,
      options: options,
    });
  } else {
    const options = await utilities.getOptions();
    req.flash("notice", "Sorry, failed to add new inventory.");
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Inventory",
      options: options,
      nav,
      errors: null,
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build Edit Inventory View
 * ************************** */
 invCont.buildEditInventory = async function (req, res, next) {
  const inventoryId = parseInt(req.params.inv_id)
  const nav = await utilities.getNav();
  const data = await invModel.getInventoryDetails(inventoryId)
  const itemData = data[0]
  const options = await utilities.getOptions(itemData.classification_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("inventory/edit-inventory", {
    title: `Edit ${itemName}`,
    nav,
    options: options,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  });
};

//Update Inventory Data
invCont.updateInventory = async function (req, res) {
  let nav = await utilities.getNav();
  const {
    classification_id,
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body;

  const updateResult = await invModel.updateInventory(
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
    inv_color
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash(
      "notice",
      `${itemName} was successfully updated.`
    );
    res.redirect("/inv/")
  } else {
    const options = await utilities.getOptions();
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, failed to update inventory.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit" + itemName,
      options: options,
      nav,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    });
  }
};

/* ***************************
 *  Build Delete Inventory View
 * ************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
  const inventoryId = parseInt(req.params.inv_id)
  const nav = await utilities.getNav();
  const data = await invModel.getInventoryDetails(inventoryId)
  const itemData = data[0]
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("inventory/delete-confirm", {
    title: `Delete ${itemName}`,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  });
};

//Delete Inventory Data
invCont.deleteInventory = async function (req, res) {
  let nav = await utilities.getNav();
  const {inv_id} = req.body;
  const idNumber = parseInt(inv_id)

  const deleteResult = await invModel.deleteInventory(idNumber);

  if (deleteResult) {
    req.flash(
      "notice",
      `Vehicle was successfully deleted.`
    );
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, failed to delete inventory.");
    res.status(501).redirect("inv/delete/:inv_id")
};
}




module.exports = invCont;
