var express = require("express");
var router = express.Router();
const bcrypt = require('bcrypt');
const oracledb = require('oracledb');
const multer =require('multer');
const session = require('express-session');
const path = require('path');
const fs = require('fs/promises');
const db = require('../../db');


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const userID = req.body.userID;
        console.log('Received userID from multer:', userID);
        const userFolder = path.join( 'public', 'Images','User', userID);
        console.log('Received directory from multer:', userFolder);
        fs.mkdir(userFolder, { recursive: true })
            .then(() => {
                callback(null, userFolder);
            })
            .catch((err) => {
                callback(err);
            });
    },
    filename: (req, file, callback) => {
        callback(null, file.fieldname + '-' + 'profilePicture' + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

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
        // const result = await runProcFunc(query, binds);
        const result = await db.runProcFunc(query, binds);
        console.log(result.outBinds);
        if (result.outBinds.count == 0) return true;
        else return false;
    } catch (error) {
        console.error('Error checking unique userID:', error);
        return false;
    }
}

router.post('/', upload.single('photo'), async (req, res) => {
    const userID = req.body.userID;
    req.session.userID = userID;
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
    if (req.file) {
        photoURL = `/Images/User/${userID}/${req.file.filename}`;
    }
    else {
        photoURL = 'https://www.seekpng.com/png/detail/41-410093_circled-user-icon-user-profile-icon-png.png';
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

        const query = `
          INSERT INTO Users(userID, Name, email, phone, address, Password, Image, rawPassword)
          VALUES(:userID, :fullName, :email, :phone, :address, :hashedPassword, :photoURL, :rawPassword)`;

        console.log('Executing query:', query);
        await db.runQuery(query, [userID, fullName, email, phone, address, hashedPassword, photoURL, rawPassword]);

        console.log('User signed up successfully!');
        res.json({ success: true, message: 'Signup successful' });
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).json({ success: false, message: 'Error signing up!' });
    }
});


module.exports=router;