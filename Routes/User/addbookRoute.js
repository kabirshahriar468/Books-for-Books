var express = require("express");
var router = express.Router();
// const bcrypt = require('bcrypt');
const oracledb = require('oracledb');
const multer =require('multer');
const session = require('express-session');
const path = require('path');
const fs = require('fs/promises');

const db = require('../../db');
console.log(__dirname);

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
                res.render('addbook', { user: userObject, blog: blog });
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
router.get('/getISBN', async (req, res) => {
    console.log("inside getISBN router....");

    //Write function in SQL
    try {
        const isbnArr = await db.runQuery("SELECT ISBN FROM BOOKS", []);
        if (isbnArr) {
            return res.json({ success: isbnArr, message: 'User not found' });
        } else {
            return res.json({ success: null, message: 'No ISBN number found' })
        }


    } catch (error) {
        console.error('Error Getting ISBN numbers from server:', error);
        res.status(500).json({ success: false, message: 'Error Getting ISBN numbers from server' });
    }
});
router.post('/getISBNdata', async (req, res) => {
    console.log("inside getISBNdata router....");
    const isbn = req.body.isbn;
    //Write function in SQL
    try {
        const param = await db.runQuery("SELECT * FROM BOOKS WHERE ISBN=:isbn", [isbn]);

        const isbnArr = await db.runQuery("SELECT * FROM BOOKS", []);
        if (isbnArr) {
            return res.json({ success: isbnArr, message: 'User not found' });
        } else {
            return res.json({ success: null, message: 'No ISBN number found' })
        }


    } catch (error) {
        console.error('Error Getting ISBN numbers from server:', error);
        res.status(500).json({ success: false, message: 'Error Getting ISBN numbers from server' });
    }
});

router.get('/getISBNdata/:isbn', async (req, res) => {
    console.log("inside getISBNdata router....");
    const isbn = req.params.isbn;
    const userID=req.session.userID;
    //Write function in SQL
    try {
        const bookParam = await db.runQuery("SELECT * FROM BOOKS WHERE ISBN=:isbn", [isbn]);
        const publisher= await db.runQuery("SELECT PUBLISHER FROM PUBLISHEDBY WHERE BOOKISBN=:isbn",[isbn]);
        const publisherURL=await db.runQuery(`SELECT URL FROM PUBLISHERS WHERE PUBLISHERNAME=(SELECT PUBLISHER FROM PUBLISHEDBY
                                                    WHERE BOOKISBN =:isbn)`,[isbn]);
        const author=await db.runQuery(`SELECT AUTHOR FROM WRITTENBY WHERE BOOKISBN=:isbn`,[isbn]);
        const price=await db.runQuery(`SELECT PRICE FROM OWNEDBY WHERE BOOKISBN=:isbn`,[isbn]);
        //console.log(param[0]);
        const bookInfoObject={
            title:bookParam[0][1],
            publishYear:bookParam[0][2],
            description:bookParam[0][3],
            publisher:publisher[0][0],
            publisherURL:publisherURL[0][0],
            author:author[0][0],
            price:price[0][0]
        };

        //console.log("NOBO is the "+userID);
        console.log(bookInfoObject);
        // const isbnArr = await db.runQuery("SELECT * FROM BOOKS", []);
        // if (isbnArr) {
        //     return res.json({ success: isbnArr, message: 'User not found' });
        // } else {
        //     return res.json({ success: null, message: 'No ISBN number found' })
        // }
        return res.json({ bookInfoObject:bookInfoObject ,  status:true});


    } catch (error) {
        console.error('Error Getting ISBN data  from server:', error);
        res.status(500).json({ success: false, message: 'Error Getting ISBN data from server' });
    }
});


const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const ISBN = req.body.ISBN;
        const userID=req.session.userID;

        console.log('Received ISBN from multer:', ISBN);
        console.log('Received userID from multer:', userID);

       // const userFolder = path.join('e:\OneDrive\Desktop\BooksForBooks-main 2', 'public', 'Images','Books', userID);
        // const userFolder = path.join(__dirname, 'Images','Books', userID);
        const userFolder = path.join('public', 'Images','Books', userID);

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
        callback(null, file.fieldname + '-' + 'bookPicOf' +req.body.ISBN+ path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


router.post('/submitInfo', upload.single('photo'), async (req, res) => {
    const userID = req.session.userID;
    //req.session.userID = userID;
    // bookData.append('ISBN', Isbn);
    // bookData.append('Title', Title);
    // bookData.append('PublishYear', PublishYear);
    // bookData.append('Description', Description);
    // bookData.append('Publisher', Publisher);
    // bookData.append('PublisherUrl', PublisherUrl);
    // bookData.append('AuthorName',AuthorName);
    // bookData.append('Price',Price);
    // bookData.append('photo', photoInput.files[0]);

    console.log("Inside SubmitInfo");
    const Isbn = req.body.ISBN;
    let Title = '';
    if (req.body.Title) {
        Title = req.body.Title;
    }
    let PublishYear = '';
    if (req.body.PublishYear) {
       PublishYear = req.body.PublishYear;
    }
    let Publisher = '';
    if (req.body.Publisher) {
       Publisher = req.body.Publisher;
    }
    let PublisherUrl = '';
    if (req.body.PublisherUrl) {
       PublisherUrl= req.body.PublisherUrl;
    }
    let AuthorName = '';
    if (req.body.AuthorName) {
       AuthorName = req.body.AuthorName;
    }
    let Price = '';
    if (req.body.Price) {
       Price = req.body.Price;
    }
    let Description = '';
    if (req.body.Description) {
       Description = req.body.Description;
    }
    // const address = req.body.address;
    // const rawPassword = req.body.password;
    let Genre1='';
    if(req.body.Genre1){
        Genre1=req.body.Genre1;
    }
    let Genre2='';
    if(req.body.Genre2){
        Genre2=req.body.Genre2;
    }
    let Genre3='';
    if(req.body.Genre3){
        Genre3=req.body.Genre3;
    }
    let photoURL = '';
    if (req.file) {
        photoURL = `/Images/Books/${userID}/${req.file.filename}`;
    }
    else {
        photoURL = 'https://www.seekpng.com/png/detail/41-410093_circled-user-icon-user-profile-icon-png.png';
    }
    // const saltRounds = 10;

    // console.log('Received data from client:');
    // console.log('userID:', userID);
    // console.log('fullName:', fullName);
    // console.log('email:', email);
    // console.log('phone:', phone);

    // const isUnique = await checkUniqueUserID(userID);
    // if (!isUnique) {
    //     return res.status(400).json({ success: false, message: 'UserID is already taken' });
    // }

    //console.log('Hashing the password...');
    try {
        // const hashedPassword = await bcrypt.hash(rawPassword, saltRounds);
        // console.log('Hashed password:', hashedPassword);

        // const query = `
        //   INSERT INTO Users(userID, Name, email, phone, address, Password, Image, rawPassword)
        //   VALUES(:userID, :fullName, :email, :phone, :address, :hashedPassword, :photoURL, :rawPassword)`;
        const qSearchIsbn=`SELECT ISBN FROM BOOKS WHERE ISBN=:Isbn`;
        const qSearchIsbnResult =await db.runQuery(qSearchIsbn, [Isbn]);
        console.log("qSearchIsbnResult ==="+qSearchIsbnResult);
        if(qSearchIsbnResult!=''){
            const query=`INSERT INTO OWNEDBY(OWNER,BOOKISBN,COVER,PRICE,ID,GENRE1,GENRE2,GENRE3)
            VALUES(:userID,:Isbn,:photoURL,:Price,OWNEDBY_ID_SEQ.NEXTVAL,:Genre1,:Genre2,:Genre3)`;

            console.log('Executing query:', query);
            console.log(userID+" "+Isbn+" "+photoURL+" "+Price)
            await db.runQuery(query, [userID,Isbn,photoURL,Price,Genre1,Genre2,Genre3]);

            console.log('Book Info Updated Successfully!');
            res.json({ success: true, message: 'Add a Book successful'});
        }else{
            const qInsertIntoBooks=`INSERT INTO BOOKS(ISBN,TITLE,PUBLISHYEAR,DESCRIPTION)
            VALUES(:Isbn,:Title,:PublishYear,:Description)`;
            await db.runQuery(qInsertIntoBooks, [Isbn,Title,PublishYear,Description]);


            const qInsertIntoPublishers=`INSERT INTO PUBLISHERS(PUBLISHERNAME,URL)
            VALUES(:Publisher,:PublisherUrl)`;
            await db.runQuery(qInsertIntoPublishers, [Publisher,PublisherUrl]);
            console.log('Executing query:', qInsertIntoBooks);



            const query=`INSERT INTO OWNEDBY(OWNER,BOOKISBN,COVER,PRICE,ID,GENRE1,GENRE2,GENRE3)
            VALUES(:userID,:Isbn,:photoURL,:Price,OWNEDBY_ID_SEQ.NEXTVAL,:Genre1,:Genre2,:Genre3)`;

            console.log('Executing query:', query);
            console.log(userID+" "+Isbn+" "+photoURL+" "+Price)
            await db.runQuery(query, [userID,Isbn,photoURL,Price,Genre1,Genre2,Genre3]);
            // const query=`INSERT INTO OWNEDBY(OWNER,BOOKISBN,COVER,PRICE)
            // VALUES(:userID,:Isbn,:photoURL,:Price)`;

            // console.log('Executing query:', query);
            // await db.runQuery(query, [userID,Isbn,photoURL,Price]);

            console.log('Book Info Updated Successfully!');
            res.json({ success: true, message: 'Add a Book successful'});

        }
        // const query=`INSERT INTO OWNEDBY(OWNER,BOOKISBN,COVER,PRICE)
        // VALUES(:userID,:Isbn,:photoURL,:Price);`

        // console.log('Executing query:', query);
        // await db.runQuery(query, [userID,Isbn,photoURL,Price]);

        // console.log('User signed up successfully!');
        // res.json({ success: true, message: 'Signup successful'});
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).json({ success: false, message: 'Error signing up!' });
    }
});

module.exports = router;
