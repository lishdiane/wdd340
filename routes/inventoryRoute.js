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
router.get("/", 
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildManagement));

//Route to build Add New Classification view
router.get("/add-classification", 
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildAddClassification));

//Route to build Add New Inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

//Route to add a new classificatiion
router.post("/add-classification", 
    utilities.checkLogin,
    utilities.checkAccountType,
    validate.classificationRules(),
    validate.checkClassificationData,
    utilities.handleErrors(invController.addNewClassification));

//Route to add new inventory
router.post("/add-inventory",
    utilities.checkLogin, 
    utilities.checkAccountType,
    validate.inventoryRules(),
    validate.checkInventoryData,
    utilities.handleErrors(invController.addNewInventory));

//Route to get Inventory JSON
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

//Route to modify Inventory view
router.get("/edit/:inv_id", 
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildEditInventory))

//Route to edit Inventory data
router.post("/update/",
    utilities.checkLogin,
    utilities.checkAccountType,
    validate.inventoryRules(),
    validate.checkUpdateData, 
    utilities.handleErrors(invController.updateInventory))

//Route to build Delete Inventory view
router.get("/delete/:inv_id", 
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildDeleteInventory))

//Route to Delete Inventory data
router.post("/delete/", 
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.deleteInventory))

//Route to inventory reviews view
router.get("/reviews/:inv_id", 
  //  utilities.checkLogin,
    utilities.handleErrors(invController.buildReviewsByInvId))

//Route to process review post
router.post("/add-review",
    utilities.checkLogin,
    validate.reviewRules(),
    validate.checkReviewData, 
    utilities.handleErrors(invController.postReview))

//Route to remove a review
router.get("/review/remove/:review_id",
    utilities.checkLogin,
    utilities.handleErrors(invController.removeReview)
)


module.exports =  router;
