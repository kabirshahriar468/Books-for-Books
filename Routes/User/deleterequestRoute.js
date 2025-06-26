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
            `DELETE FROM USERS
            WHERE UserID = :userID`;
        await db.runQuery(query, [userID]);

        res.json({ success: true, message: 'Deleted user successfully' });
    } catch (error) {
        console.error('Error adding post:', error);
        res.status(500).json({ success: false, message: 'Error adding post' });
    }
});



module.exports=router;