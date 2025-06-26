var express = require("express");
var router = express.Router();
// const bcrypt = require('bcrypt');
const oracledb = require('oracledb');
const session = require('express-session');

const db = require('../../db');



router.get('/', async (req, res) => {
    const author = req.session.userID;
    try {
        const query =
        `SELECT  B.TITLE,COUNT(*)
        FROM WRITTENBY W JOIN BOOKS B ON W.BOOKISBN=B.ISBN
        JOIN OWNEDBY O ON O.BOOKISBN=B.ISBN
        WHERE W.AUTHOR =:author
        GROUP BY B.TITLE
        ORDER BY B.TITLE ASC`;
        const bookdata = await db.runQuery(query, [author]);
        var bookpics=[];
        for(let i=0;i<bookdata.length;i++){
            let title=bookdata[i][0];
            const res=await db.runQuery(`SELECT COVER FROM OWNEDBY O JOIN BOOKS B ON O.BOOKISBN=B.ISBN
            WHERE B.TITLE=:title`,[title]);
            bookpics.push(res[0][0]);
        }
        const dp = await db.runQuery(`SELECT IMAGE
                                FROM AUTHORS
                                WHERE AUTHORNAME = :author`, [author]);

        res.render('mybook_author', { bookdata: bookdata,bookpics:bookpics, dp });
    } catch (error) {
        console.error('Error adding post:', error);
        res.status(500).json({ success: false, message: 'Error adding post' });
    }
});
module.exports = router;
