// Needed resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities")
const validate = require("../utilities/inventory-validation")


// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory details view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));


/* ******************
 * Management routes 
 **********************/

// Route to build management view
router.get("/", utilities.handleErrors(invController.buildManagement));

//Route to build Add New Classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

//Route to build Add New Inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

//Route to add a new classificatiion
router.post("/add-classification", 
    validate.classificationRules(),
    validate.checkClassificationData,
    utilities.handleErrors(invController.addNewClassification));

//Route to add new inventory
router.post("/add-inventory", 
    validate.inventoryRules(),
    validate.checkInventoryData,
    utilities.handleErrors(invController.addNewInventory));

//Route to get Inventory JSON
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

//Route to modify Inventory view
router.get("/edit/:inv_id", utilities.handleErrors(invController.buildEditInventory))

//Route to process the Inventoy edit
router.post("/update/",
    validate.inventoryRules(),
    validate.checkUpdateData, 
    utilities.handleErrors(invController.updateInventory))

module.exports =  router;
