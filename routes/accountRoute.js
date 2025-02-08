const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const accountValidate = require("../utilities/account-validation");

// Route to build the login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build the register view
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

// Route to register an account
router.post(
  "/register",
  accountValidate.registrationRules(),
  accountValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
  "/login",
  accountValidate.loginRules(),
  accountValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

//route to build account view
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccount)
);

//route to logout
router.get("/logout", utilities.handleErrors(accountController.logout));

//route to update account view
router.get("/update-account/:account_id", 
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateAccount))

//route to process account data update
router.post("/update/", 
  utilities.checkLogin,
  accountValidate.accountRules(),
  accountValidate.checkAccountData,
  utilities.handleErrors(accountController.updateAccount))

//route to process password change
router.post("/change-password", 
  accountValidate.passwordRules(),
  accountValidate.checkPasswordData,
  utilities.handleErrors(accountController.changePassword))

module.exports = router;
