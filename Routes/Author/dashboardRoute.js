var express = require("express");
var router = express.Router();
// const bcrypt = require('bcrypt');
const oracledb = require('oracledb');
const session = require('express-session');

const db =require('../../db');

// async function runQuery(query, params) {
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
router.get('/',async (req, res) => {
    const userID = req.session.userID;

    if (userID) {
        try {
            const data =await db.runQuery(`SELECT AUTHORNAME, URL,IMAGE, Email,DESCRIPTION
                FROM "BOOKSFORBOOKS"."AUTHORS" WHERE AUTHORNAME = :userID`, [userID]);
            
            console.log("Data: ",data);
            if (data.length > 0) {
                const user = data[0];
                const authorObject = {
                    authorName: user[0],
                    url: user[1],
                    image: user[2],
                    email: user[3],
                    description: user[4]
                };
                res.render('dashboard_author', { author: authorObject });
            } else {
                res.status(404).json({ error: 'Author not found' });
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'An error occurred' });
        }
    } else {
        // User is not authenticated, redirect to login
        res.redirect('/');
    }
});

module.exports = router;
