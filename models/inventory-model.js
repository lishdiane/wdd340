const pool = require("../database/");

// get all classification data
async function getClassifications() {
  try {
    return await pool.query(
      "SELECT * FROM public.classification ORDER BY classification_name"
    );
  } catch (error) {
    console.error("getclassifications error" + error);
  }
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyid error" + error);
  }
}

async function getInventoryDetails(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory
        WHERE inv_id = $1;`,
      [inv_id]
    );
    return data.rows;
  } catch (error) {
    console.error(error + "at getinventorydetails");
  }
}

/* ***************************
 *  Add New Classification
 * ************************** */

async function addNewClassification(classification_name) {
  try {
    const sql =
      "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *";
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    console.log(error.message);
  }
}

/* ***************************
 *  Add New Inventory
 * ************************** */

async function addNewInventory(
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
) {
  try {
    const sql =
      "INSERT INTO public.inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
    return await pool.query(sql, [
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
    ]);
  } catch (error) {
    console.log(error.message);
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */

async function updateInventory(
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *";
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id,
    ]);
    return data.rows[0];
  } catch (error) {
    console.log("model error: " + error);
  }
}

/* ***************************
 * Delete Inventory Data
 * ************************** */

async function deleteInventory(inv_id) {
  try {
    const sql = "DELETE FROM inventory WHERE inv_id = $1";
    const data = await pool.query(sql, [inv_id]);
    return data;
  } catch (error) {
    console.log("model error: " + error);
  }
}

/* ***************************
 *  Get all reviews by inv id
 * ************************** */

async function getReviewByInvId(inv_id) {
  const data = await pool.query("SELECT * FROM public.review WHERE inv_id = $1 ORDER BY review_date DESC", [
    inv_id
  ]);
  return data.rows;
}

/* ***************************
 *  Get only 2 top rated reviews
 * ************************** */

async function getTwoReviews(inv_id) {
  const data = await pool.query("SELECT * FROM public.review WHERE inv_id = $1 ORDER BY review_date DESC LIMIT 2", [
    inv_id
  ]);
  return data.rows;
}

/* ***************************
 *  Get all reviews by account id
 * ************************** */

async function getReviewByAccountId(account_id) {
  const data = await pool.query("SELECT * FROM public.review WHERE account_id = $1 ORDER BY review_date DESC", [
    account_id
  ]);
  return data.rows;
}

/* ***************************
 *  Add Review to database
 * ************************** */

async function addReview(review_rating, review_text, account_id, inv_id) {
  try {
    const sql =
      "INSERT INTO public.review (review_rating, review_text, account_id, inv_id) VALUES ($1, $2, $3, $4) RETURNING *";
    return await pool.query(sql, [review_rating, review_text, account_id, inv_id]);
  } catch (error) {
    console.log(error.message);
  }
}

/* ***************************
 * Remove Review Data
 * ************************** */

async function removeReview(review_id) {
  try {
    const sql = "DELETE FROM review WHERE review_id = $1";
    const data = await pool.query(sql, [review_id]);
    return data;
  } catch (error) {
    console.log("model error: " + error);
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryDetails,
  addNewClassification,
  addNewInventory,
  updateInventory,
  deleteInventory,
  getReviewByInvId,
  addReview,
  getTwoReviews,
  getReviewByAccountId,
  removeReview
};
