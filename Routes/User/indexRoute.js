var express = require("express");
var router = express.Router();
// const bcrypt = require('bcrypt');
const oracledb = require('oracledb');
const session = require('express-session');

const db = require('../../db');

// async function db.runQuery(query, params) {
//     const connection = db.getConnection();

//     try {
//         const result = await connection.execute(query, params);
//         await connection.commit();
//         return result.rows;
//     }  catch (error) {
//         console.error('Error executing query:', error);
//         throw error;
//     }
// }
// console.log("dashing...........");
// async function runProcFunc(query, params) {
//     const connection = db.getConnection();

//     try {
//         const result = await connection.execute(query, params);
//         return result;
//     } catch (error) {
//         console.error('Error executing procedure/function:', error);
//         throw error;
//     }
// }
router.get('/', async (req, res) => {

    const bookCountResult = await db.runQuery("SELECT COUNT(*) FROM OwnedBy", []);
    const bookCount = bookCountResult[0][0];
    const userCountResult = await db.runQuery("SELECT COUNT(*) FROM Users", []);
    const userCount = userCountResult[0][0];
    const postCountResult = await db.runQuery("SELECT COUNT(*) FROM Blog", []);
    const postCount = postCountResult[0][0];
    const transactionCountResult = await db.runQuery("SELECT COUNT(*) FROM Requests", []);
    const transactionCount = transactionCountResult[0][0];

    console.log("logginnnnnnnnnnn");
    // Render the EJS template and pass productCount as data
    // res.render("index", { bookCount, userCount });
    res.render('index_user', {bookCount, userCount, postCount, transactionCount });
    // res.render('index_user', { user: userObject, blog: blog });
});

module.exports = router;
