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
        const publisher = req.body.publisherName;
        console.log('Received userID from multer:', publisher);
        const userFolder = path.join( 'public', 'Images','Publisher', publisher);
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
        `SELECT PUBLISHERNAME FROM PUBLISHERS 
        WHERE PUBLISHERNAME=:ID`;
    
        const result =await db.runQuery(query,[ID]);
        console.log(result);
        if(result==''){
            return true;
        }else{
            return false;
        }
        
    } catch (error) {
        console.error('Error checking unique Publisher Name:', error);
        return false;
    }
}

router.post('/', upload.single('photo'), async (req, res) => {
    const publisherName = req.body.publisherName;
    req.session.userID = publisherName;
    //const fullName = req.body.fullName;
    let email = '';
    if (req.body.email) {
        email = req.body.email;
    }
    let url = '';
    if (req.body.url) {
        url = req.body.url;
    }
    let description = '';
    if (req.body.description) {
        description = req.body.description;
    }
    let password = '';
    if (req.body.password) {
        password = req.body.password;
    }
    let address = '';
    if (req.body.address) {
        address = req.body.address;
    }
 
    let logoURL = '';
    if (req.file) {
        logoURL = `/Images/Publisher/${publisherName}/${req.file.filename}`;
    }
    else {
        logoURL = 'https://www.seekpng.com/png/detail/41-410093_circled-user-icon-user-profile-icon-png.png';
    }
    const saltRounds = 10;

    console.log('Received data from client:');
    console.log('userID:', publisherName);
    console.log('email:', email);
    console.log('phone:', url);

    const isUnique = await checkUniqueUserID(publisherName);
    if (!isUnique) {
        return res.status(400).json({ success: false, message: 'Publisher name already exists.' });
    }

    //console.log('Hashing the password...');
    try {
        //const hashedPassword = await bcrypt.hash(rawPassword, saltRounds);
        //console.log('Hashed password:', hashedPassword);

        const query = `
          INSERT INTO PUBLISHERS(PUBLISHERNAME,  email,LOGO,URL, DESCRIPTION,ADDRESS, Password)
          VALUES(:publisherName, :email, :logoURL, :url, :description,:address,:password)`;

        console.log('Executing query:', query);
        await db.runQuery(query, [publisherName, email,logoURL,url,description,address, password]);

        console.log('Publisher signed up successfully!');
        res.json({ success: true, message: 'Signup successful' });
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).json({ success: false, message: 'Error signing up!' });
    }
});


module.exports=router;