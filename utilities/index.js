const invModel = require("../models/inventory-model");
const accountModel = require("../models/account-model");
const Util = {};
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

// Build Inventory Details HTML
Util.buildDetails = async function (data) {
  const vehicle = data[0];
  let details;
  if (data.length > 0) {
    details = `
    <div id="details-view">
      <img src="${vehicle.inv_image}" alt="${vehicle.inv_year} ${
      vehicle.inv_make
    } ${vehicle.inv_model} vehicle image" width="500" height="300">
      <section>
        <h2>${vehicle.inv_year} ${vehicle.inv_make} ${
      vehicle.inv_model
    } Details</h2>
        <ul>
          <li><strong>Price: </strong>$${new Intl.NumberFormat("en-US").format(
            vehicle.inv_price
          )}</li>
          <li><strong>Description: </strong>${vehicle.inv_description}</li>
          <li><strong>Color: </strong>${vehicle.inv_color}</li>
          <li><strong>Miles: </strong>${new Intl.NumberFormat("en-US").format(
            vehicle.inv_miles
          )}</li>
        </ul>
        <a href="/inv/reviews/${vehicle.inv_id}"> View all reviews}</a>
      </section>
    </div>`;
  } else {
    details = `<p>Sorry, no matching vehicles could be found.</p>`;
  }
  return details;
};

/* ************************
 * Constructs the <select> options for Add Inventory form
 ************************** */
Util.getOptions = async function (classificationId = null) {
  const data = await invModel.getClassifications();
  let classificationList = [];
  data.rows.forEach((row) => {
    let option = `<option value="${row.classification_id}">${row.classification_name}</option>`;
    if (classificationId != null && classificationId == row.classification_id) {
      option = `<option selected value="${row.classification_id}">${row.classification_name}</option>`;
    }
    classificationList.push(option);
  });
  const classifications = classificationList.join("");
  return classifications;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

/* ****************************************
 *  Check Account Type
 * ************************************ */
Util.checkAccountType = (req, res, next) => {
  if (
    res.locals.accountData.account_type == "Admin" ||
    res.locals.accountData.account_type == "Employee"
  ) {
    next();
  } else {
    req.flash("notice", "Only Employees or Admins have this access.");
    return res.redirect("/account/login");
  }
};

/* **************************************
 * Build Review List
 * ************************************ */
Util.buildReviewList = async function (reviewData) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const list = [];

  for(const item of reviewData) {
    const accountData = await accountModel.getAccountById(parseInt(item.account_id))    

    const stars = () => {
      return item.review_rating == 1
      ? "⭐"
      : item.review_rating == 2
      ? "⭐⭐"
      : item.review_rating == 3
      ? "⭐⭐⭐"
      : item.review_rating == 4
      ? "⭐⭐⭐⭐"
      : "⭐⭐⭐⭐⭐";
    };
    
    const html = `
      <div class="review-card">
      <p class="review-card-name" ><strong>${accountData.account_firstname} ${
      accountData.account_lastname[0]
    }.</strong></p>
      <p>${stars()}</p>
      <p class="review-card-date" >Reviewed on ${item.review_date.toLocaleDateString(
        undefined,
        options
      )}.</p>
      <p class="review-card-text" >${item.review_text}</p>
      </div>
    `;

    list.push(html)
  };

  reviewSection = `
    <section id="reviews">
      ${list.join("")}
    </section>
`;
  if (list.length > 0) {
    return reviewSection;
  } else {
    return `<p class="none" >There are no reviews for this vehicle.</p>`;
  }
};

module.exports = Util;
