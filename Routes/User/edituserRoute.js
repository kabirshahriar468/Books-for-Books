var express = require("express");
var router = express.Router();
// const bcrypt = require('bcrypt');
const oracledb = require('oracledb');
const multer =require('multer');
const session = require('express-session');
const path = require('path');
const fs = require('fs/promises');

const db = require('../../db');


router.get('/', async (req,res) =>{
    const userID = req.session.userID;
    if(userID) {
        try {
            const data = await db.runQuery(`SELECT UserID, Name, Email, Phone, Address, Image, RawPassword
            FROM Users WHERE UserID = :userID`,[userID]);
            if (data.length > 0) {
                const user = data[0];
                const userObject = {
                    userID: user[0],
                    name: user[1],
                    email: user[2],
                    phone: user[3],
                    address: user[4],
                    image: user[5],
                    rawPassword: user[6]
                };
                res.render('editUser', { user: userObject}); 
            }
        } catch(error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'An error occurred' });
        }
    }
    else
    {
        res.redirect('/');
    }
});




module.exports=router;