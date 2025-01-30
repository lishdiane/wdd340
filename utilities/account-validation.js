const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {}
const accountModel = require("../models/account-model")

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
 validate.registrationRules = () => {
    return[
        //first name is required and must be a string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 1})
            .withMessage("Please provide a first name."),

        //lastname is required and must be a string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 2})
            .withMessage("Please provide a last name."),

        //valid email is required and cannot already exhist in the DB
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required.")
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists){
                    throw new Error("Email already exists in the system. Please log in or use different email")
                }
            }),

        //password is required and must be strong
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements.")
    ]
 }
 

 /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const {account_firstname, account_lastname, account_email} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors, 
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

/* ****************************************
*  Validate Login
* *************************************** */

validate.loginRules = () => {
    return[
        //valid email is required and must exhist in the DB
        body("account_email")
        .trim()
        .escape()
        .notEmpty()
        .isEmail()
        .normalizeEmail()
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
            const emailExists = await accountModel.checkExistingEmail(account_email)
            if (!emailExists){
                throw new Error("Email does not exist in the system. Please try a different email or register below.")
            }
        }),

        //password is required and must be strong
        body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage("Password does not meet requirements.")
    ]
}


 /* ******************************
 * Check data and return errors or continue to Login
 * ***************************** */
 validate.checkLoginData = async (req, res, next) => {
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
            errors, 
            title: "login",
            nav,
        })
        return
    }
    next()
}


module.exports = validate