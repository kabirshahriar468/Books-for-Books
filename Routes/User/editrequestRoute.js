var express = require("express");
var router = express.Router();
const bcrypt = require('bcrypt');
const oracledb = require('oracledb');
const multer =require('multer');
const session = require('express-session');
const path = require('path');
const fs = require('fs/promises');

const db = require('../../db');

async function checkUniqueUserID(ID) {
    try {
        const query =
            `BEGIN
           :count := check_unique_userid(:userID);
        END;`;

        const binds = {
            userID: ID,
            count: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
        };
        const result = await db.runProcFunc(query, binds);
        console.log(result.outBinds);
        if (result.outBinds.count == 0) return true;
        else return false;
    } catch (error) {
        console.error('Error checking unique userID:', error);
        return false;
    }
}

router.post('/', async (req, res) => {
    const userID = req.body.userID;
    // req.session.userID = userID;
    const oldID = req.session.userID;
    const fullName = req.body.fullName;
    let email = '';
    if (req.body.email) {
        email = req.body.email;
    }
    let phone = '';
    if (req.body.phone) {
        phone = req.body.phone;
    }
    const address = req.body.address;
    const rawPassword = req.body.password;
    let photoURL = '';
    if(req.body.photo){
        photoURL = req.body.photo;
    }
    const saltRounds = 10;

    console.log('Received data from client:');
    console.log('userID:', userID);
    console.log('fullName:', fullName);
    console.log('email:', email);
    console.log('phone:', phone);

    const isUnique = await checkUniqueUserID(userID);
    if (!isUnique) {
        return res.status(400).json({ success: false, message: 'UserID is already taken' });
    }

    console.log('Hashing the password...');
    try {
        const hashedPassword = await bcrypt.hash(rawPassword, saltRounds);
        console.log('Hashed password:', hashedPassword);

        // const query = `
        //   INSERT INTO Users(userID, Name, email, phone, address, Password, Image, rawPassword)
        //   VALUES(:userID, :fullName, :email, :phone, :address, :hashedPassword, :photoURL, :rawPassword)`;

        const query = `UPDATE Users
                        SET UserID = :userID , Name = :fullName, Email = :email, Phone = :phone, Address = :address,
                        Password = :hashedPassword, Image = :photoURL, rawPassword = :rawPassword
                        WHERE UserID = :oldID`;

        console.log('Executing query:', query);
        await db.runQuery(query, [userID, fullName, email, phone, address, hashedPassword, photoURL, rawPassword, oldID]);
        req.session.userID = userID;
        console.log('User signed up successfully!');
        res.json({ success: true, message: 'Edit User Info successful' });
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).json({ success: false, message: 'Error Edit User Info!' });
    }
});





module.exports=router;

