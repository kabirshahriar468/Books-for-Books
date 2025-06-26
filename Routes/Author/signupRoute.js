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
        const authorName = req.body.authorName;
        console.log('Received userID from multer:', authorName);
        const userFolder = path.join( 'public', 'Images','Author', authorName);
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



// const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         const ISBN = req.body.ISBN;
//         const userID=req.session.userID;

//         console.log('Received ISBN from multer:', ISBN);
//         console.log('Received userID from multer:', userID);

//        // const userFolder = path.join('e:\OneDrive\Desktop\BooksForBooks-main 2', 'public', 'Images','Books', userID);
//         // const userFolder = path.join(__dirname, 'Images','Books', userID);
//         const userFolder = path.join('public', 'Images','Books', userID);

//         console.log('Received directory from multer:', userFolder);
//         fs.mkdir(userFolder, { recursive: true })
//             .then(() => {
//                 callback(null, userFolder);
//             })
//             .catch((err) => {
//                 callback(err);
//             });
//     },
//     filename: (req, file, callback) => {
//         callback(null, file.fieldname + '-' + 'bookPicOf' +req.body.ISBN+ path.extname(file.originalname));
//     }
// });

// const upload = multer({ storage: storage });
async function checkUniqueUserID(ID) {
    try {
        const query =
        `SELECT AUTHORNAME FROM AUTHORS 
        WHERE AUTHORNAME=:ID`;
    
        const result =await db.runQuery(query,[ID]);
        console.log(result);
        if(result==''){
            return true;
        }else{
            return false;
        }
        
    } catch (error) {
        console.error('Error checking unique Author Name:', error);
        return false;
    }
}

router.post('/', upload.single('photo'), async (req, res) => {
    const authorName = req.body.authorName;
    req.session.userID = authorName;
    // formData.append('authorName', authorName);
    // formData.append('email', email);
    // formData.append('url', url);
    // formData.append('description', description);
    // formData.append('password', password);
    // formData.append('photo', photoInput.files[0]);

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
 
    let photoURL = '';
    if (req.file) {
        photoURL = `/Images/Author/${authorName}/${req.file.filename}`;
    }
    else {
        photoURL = 'https://www.seekpng.com/png/detail/41-410093_circled-user-icon-user-profile-icon-png.png';
    }
    const saltRounds = 10;

    console.log('Received data from client:');
    console.log('userID:', authorName);
    console.log('email:', email);
    console.log('phone:', url);

    const isUnique = await checkUniqueUserID(authorName);
    if (!isUnique) {
        return res.status(400).json({ success: false, message: 'Author name already exists.' });
    }

    //console.log('Hashing the password...');
    try {
        //const hashedPassword = await bcrypt.hash(rawPassword, saltRounds);
        //console.log('Hashed password:', hashedPassword);

        const query = `
          INSERT INTO AUTHORS(AUTHORNAME, URL,IMAGE, email, DESCRIPTION, Password)
          VALUES(:authorName, :url, :photoURL, :email, :description,:password)`;

        console.log('Executing query:', query);
        await db.runQuery(query, [authorName, url, photoURL, email,description, password]);

        console.log('  Author signed up successfully!');
        res.json({ success: true, message: 'Signup successful' });
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).json({ success: false, message: 'Error signing up!' });
    }
});


module.exports=router;