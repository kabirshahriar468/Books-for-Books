var express = require("express");
var router = express.Router();
// const bcrypt = require('bcrypt');
const oracledb = require('oracledb');
const session = require('express-session');

const db = require('../../db');

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
async function checkMaxBook(ID) {
    try {
        const query =
            `DECLARE
            MSG VARCHAR2(10);
        BEGIN
            check_max_book(:userID, :MSG);
        END;`;

        const binds = {
            userID: ID,
            MSG: { dir: oracledb.BIND_OUT, type: oracledb.DB_TYPE_VARCHAR }
        };
        const result = await db.runProcFunc(query, binds);

        if (result.outBinds.MSG == 'yes') return true;
        else return false;
    } catch (error) {
        console.error('Error checking max books?:', error);
        return false;
    }
}

async function checkMaxPost(ID) {
    try {
        const query =
            `DECLARE
            MSG VARCHAR2(10);
        BEGIN
            check_max_post(:userID, :MSG);
        END;`;

        const binds = {
            userID: ID,
            MSG: { dir: oracledb.BIND_OUT, type: oracledb.DB_TYPE_VARCHAR }
        };
        const result = await db.runProcFunc(query, binds);

        if (result.outBinds.MSG == 'yes') return true;
        else return false;
    } catch (error) {
        console.error('Error checking max posts?:', error);
        return false;
    }
}

async function checkMaxTransaction(ID) {
    try {
        const query =
            `DECLARE
            MSG VARCHAR2(10);
        BEGIN
            check_max_transaction(:userID, :MSG);
        END;`;

        const binds = {
            userID: ID,
            MSG: { dir: oracledb.BIND_OUT, type: oracledb.DB_TYPE_VARCHAR }
        };
        const result = await db.runProcFunc(query, binds);
        if (result.outBinds.MSG == 'yes') return true;
        else return false;
    } catch (error) {
        console.error('Error checking max transactions?:', error);
        return false;
    }
}
router.get('/', async (req, res) => {
    const userID = req.session.userID;

    if (userID) {
        try {
            const data = await db.runQuery(`SELECT UserID, Name, Email, Phone, Address, Image
                FROM "BOOKSFORBOOKS"."USERS" WHERE UserID = :userID`, [userID]);
            const blog = await db.runQuery(
                `SELECT U.Name, U.Image, T.Post, time_difference(T.Timestamp) AS Time_difference
            FROM "BOOKSFORBOOKS"."USERS" U , (SELECT Writer, Post, Timestamp
                            FROM "BOOKSFORBOOKS"."POSTEDBY" P JOIN BLOG B
                            ON P.PostID = B.PostID
                            ORDER BY P.PostID) T
            WHERE U.UserID = T.Writer`, []);
            console.log("Data: ", data);
            console.log(blog);


            const notificationCnt = await db.runQuery(`SELECT COUNT(*) FROM REQUESTS WHERE SELLER_ID=:userID`, [userID]);



            if (data.length > 0) {
                const user = data[0];
                const userObject = {
                    userID: user[0],
                    name: user[1],
                    email: user[2],
                    phone: user[3],
                    address: user[4],
                    image: user[5]
                };

                const bookCountresult = await db.runQuery(`SELECT COUNT(*) FROM OwnedBy WHERE Owner = :userID`, [userID]);
                const bookCount = bookCountresult[0][0];
                const postCountresult = await db.runQuery(`SELECT COUNT(*) FROM PostedBy WHERE Writer = :userID`, [userID]);
                const postCount = postCountresult[0][0];
                const transactionCountResult = await db.runQuery(`SELECT COUNT(*) FROM Requests WHERE BUYER_ID = :userID OR SELLER_ID = :userID`,
                    [userID, userID]);
                const transactionCount = transactionCountResult[0][0];

                var textB = '';
                if (await checkMaxBook(userID) == true) {
                    textB = 'Highest till now';
                }
                var textP = '';
                if (await checkMaxPost(userID) == true) {
                    textP = 'Highest till now';
                }
                var textT = '';
                if (await checkMaxTransaction(userID) == true) {
                    textT = 'Highest till now';
                }
                //res.render('dashboard', { user: userObject, blog: blog, bookCount, postCount, transactionCount, textB, textP, textT });

                res.render('dashboard_user', { user: userObject, blog: blog, notificationCnt: notificationCnt,bookCount, postCount, transactionCount, textB, textP, textT  });
            } else {
                res.status(404).json({ error: 'User not found' });
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
