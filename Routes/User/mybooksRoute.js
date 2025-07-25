var express = require("express");
var router = express.Router();
// const bcrypt = require('bcrypt');
const oracledb = require('oracledb');
const multer =require('multer');
const session = require('express-session');
const path = require('path');
const fs = require('fs/promises');

const db = require('../../db');


router.get('/', async (req, res) => {
    const userID = req.session.userID;
    try {
        const query =
        `SELECT T1.NAME, T1.EMAIL, T1.PHONE, T1.ADDRESS, T1.IMAGE, T1.BOOKISBN, B.TITLE, B.PUBLISHYEAR, B.DESCRIPTION, T1.PRICE, T1.GENRE1, T1.GENRE2, T1.GENRE3, T1.COVER,
        W.AUTHOR, W.URL, W.EMAIL, W.DESCRIPTION, W.IMAGE, P.PUBLISHER, P.URL, P.EMAIL, P.ADDRESS, P.DESCRIPTION, P.LOGO
  FROM (SELECT NAME, EMAIL, PHONE, ADDRESS, IMAGE, PRICE, COVER, BOOKISBN, GENRE1, GENRE2, GENRE3
        FROM USERS JOIN OWNEDBY ON (USERS.USERID = OWNEDBY.OWNER)
        WHERE USERS.USERID = :userID) T1, BOOKS B,
                   (SELECT BOOKISBN, AUTHOR, URL, IMAGE, EMAIL, DESCRIPTION
                    FROM AUTHORS JOIN WRITTENBY ON (AUTHORS.AUTHORNAME = WRITTENBY.AUTHOR)) W,
                   (SELECT BOOKISBN, PUBLISHER, EMAIL, LOGO, URL, DESCRIPTION, ADDRESS
                    FROM PUBLISHERS JOIN PUBLISHEDBY ON (PUBLISHERS.PUBLISHERNAME = PUBLISHEDBY.PUBLISHER)) P
WHERE T1.BOOKISBN = B.ISBN
AND T1.BOOKISBN = W.BOOKISBN
AND T1.BOOKISBN = P.BOOKISBN`;
        const bookdata = await db.runQuery(query, [userID]);
        const dp = await db.runQuery(`SELECT IMAGE
                                FROM USERS
                                WHERE USERID = :userID`, [userID]);

        res.render('mybook_user', { bookdata: bookdata, dp });
    } catch (error) {
        console.error('Error adding post:', error);
        res.status(500).json({ success: false, message: 'Error adding post' });
    }
});




module.exports=router;