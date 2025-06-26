const oracledb = require('oracledb');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs/promises');
const app = express();
const port = 3000;

const db = require('./db');


const { count } = require('console');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static('public'));
app.use(session({
    secret: 'booksforbooks',
    resave: false,
    saveUninitialized: true
}));
app.use(express.json());

app.listen(port, async () => {
    await db.connect();
    console.log(__dirname);
    const Isbn = '9780671027032';
    
    // const tmp= await db.runQuery("SELECT PUBLISHER FROM PUBLISHEDBY WHERE BOOKISBN=:param",[param]);
    // const out=tmp[0];
    // console.log(out[0]);
    // const publisherURL=await db.runQuery(`SELECT URL FROM PUBLISHERS WHERE PUBLISHERNAME=(SELECT PUBLISHER FROM PUBLISHEDBY
    //     WHERE BOOKISBN =:isbn)`,[isbn]);
    //     console.log(publisherURL[0][0]);
    // const author=await db.runQuery(`SELECT AUTHOR FROM WRITTENBY WHERE BOOKISBN=:isbn`,[isbn]);
    // console.log(author[0][0]);
    // const info=await db.runQuery(`SELECT * FROM BOOKS
    // WHERE ISBN=:isbn`,[isbn]);
    // console.log(info[0][0]+"   "+info[0][1]+"   "+info[0][2]+"   "+info[0][3]+"   ");
    // const qSearchIsbn = `SELECT ISBN FROM BOOKS WHERE ISBN=:Isbn`;
    // const qSearchIsbnResult = await db.runQuery(qSearchIsbn, [Isbn]);
    // console.log("qSearchIsbnResult ===" + qSearchIsbnResult);
    // if(qSearchIsbnResult!=''){
    //     console.log("OK");
    // }else {
    //     console.log("MUla");
    // }

    console.log(`Server is running on port ${port} and link http://localhost:3000/`);
});

// const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         const userID = req.body.userID;
//         console.log('Received userID from multer:', userID);
//         const userFolder = path.join(__dirname, 'public', 'Images', userID);
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
//         callback(null, file.fieldname + '-' + 'profilePicture' + path.extname(file.originalname));
//     }
// });

// const upload = multer({ storage: storage });


// async function checkUniqueUserID(ID) {
//     try {
//         const query =
//             `BEGIN
//            :count := check_unique_userid(:userID);
//         END;`;

//         const binds = {
//             userID: ID,
//             count: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
//         };
//         // const result = await runProcFunc(query, binds);
//         const result = await db.runProcFunc(query, binds);
//         console.log(result.outBinds);
//         if (result.outBinds.count == 0) return true;
//         else return false;
//     } catch (error) {
//         console.error('Error checking unique userID:', error);
//         return false;
//     }
// }

// app.post('/signup', upload.single('photo'), async (req, res) => {
//     const userID = req.body.userID;
//     req.session.userID = userID;
//     const fullName = req.body.fullName;
//     let email = '';
//     if (req.body.email) {
//         email = req.body.email;
//     }
//     let phone = '';
//     if (req.body.phone) {
//         phone = req.body.phone;
//     }
//     const address = req.body.address;
//     const rawPassword = req.body.password;
//     let photoURL = '';
//     if (req.file) {
//         photoURL = `/Images/${userID}/${req.file.filename}`;
//     }
//     else {
//         photoURL = 'https://www.seekpng.com/png/detail/41-410093_circled-user-icon-user-profile-icon-png.png';
//     }
//     const saltRounds = 10;

//     console.log('Received data from client:');
//     console.log('userID:', userID);
//     console.log('fullName:', fullName);
//     console.log('email:', email);
//     console.log('phone:', phone);

//     const isUnique = await checkUniqueUserID(userID);
//     if (!isUnique) {
//         return res.status(400).json({ success: false, message: 'UserID is already taken' });
//     }

//     console.log('Hashing the password...');
//     try {
//         const hashedPassword = await bcrypt.hash(rawPassword, saltRounds);
//         console.log('Hashed password:', hashedPassword);

//         const query = `
//           INSERT INTO Users(userID, Name, email, phone, address, Password, Image, rawPassword)
//           VALUES(:userID, :fullName, :email, :phone, :address, :hashedPassword, :photoURL, :rawPassword)`;

//         console.log('Executing query:', query);
//         await db.runQuery(query, [userID, fullName, email, phone, address, hashedPassword, photoURL, rawPassword]);

//         console.log('User signed up successfully!');
//         res.json({ success: true, message: 'Signup successful' });
//     } catch (error) {
//         console.error('Error hashing password:', error);
//         res.status(500).json({ success: false, message: 'Error signing up!' });
//     }
// });


app.get('/', async (req, res) => {
    try {
        // const bookCountResult = await db.runQuery("SELECT COUNT(*) FROM Books", []);
        // const bookCount = bookCountResult[0][0];
        // const userCountResult = await db.runQuery("SELECT COUNT(*) FROM Users", []);
        // const userCount = userCountResult[0][0];

        // console.log("logginnnnnnnnnnn");
        // // Render the EJS template and pass productCount as data
        // // res.render("index", { bookCount, userCount });
         res.render("root");

    } catch (error) {
        console.error("Error fetching productCount:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.use('/userlogin', require('./Routes/User/loginRoute'));
app.use('/userdashboard', require('./Routes/User/dashboardRoute'));
app.use('/useraddpost', require('./Routes/User/addpostRoute'));
app.use('/useraddbook', require('./Routes/User/addbookRoute'));
app.use('/userindex',require('./Routes/User/indexRoute'));
app.use('/userexplore',require('./Routes/User/exploreRoute'));
app.use('/usersignup',require('./Routes/User/signupRoute'));
app.use('/request',require('./Routes/User/requestRoute'));
app.use('/notifications',require('./Routes/User/notificationRoute'));
app.use('/mybooks',require('./Routes/User/mybooksRoute'))
app.use('/search',require('./Routes/User/searchRoute'))
app.use('/editUser',require('./Routes/User/edituserRoute'))
app.use('/editrequest',require('./Routes/User/editrequestRoute'));
app.use('/deleterequest',require('./Routes/User/deleterequestRoute'));

app.use('/authorlogin',require('./Routes/Author/loginRoute'));
app.use('/authordashboard',require('./Routes/Author/dashboardRoute'));
app.use('/authorsignup',require('./Routes/Author/signupRoute'));
app.use('/authorindex',require('./Routes/Author/indexRoute'));
app.use('/authorbooks',require('./Routes/Author/mybooksRoute'));
app.use('/authorupdate',require('./Routes/Author/updateRoute'));

app.use('/publisherlogin',require('./Routes/Publisher/loginRoute'));
app.use('/publisherdashboard',require('./Routes/Publisher/dashboardRoute'));
app.use('/publishersignup',require('./Routes/Publisher/signupRoute'));
app.use('/publisherindex',require('./Routes/Publisher/indexRoute'));

app.use('/logout', require('./Routes/logOutRoute'));


// app.get('/userexplore', async (req, res) => {
//     const userID = req.session.userID;
//     try {
//         const query = 
//         `SELECT B.TITLE, T1.COVER, W.AUTHOR, P.PUBLISHER, T1.NAME, T1.PRICE
//         FROM (SELECT NAME, PRICE, COVER, BOOKISBN 
//                     FROM USERS JOIN OWNEDBY ON (USERS.USERID = OWNEDBY.OWNER)
//                     WHERE USERS.USERID <> :userID) T1, BOOKS B,
//         WRITTENBY W, PUBLISHEDBY P
//         WHERE T1.BOOKISBN = B.ISBN
//             AND T1.BOOKISBN = W.BOOKISBN
//             AND T1.BOOKISBN = P.BOOKISBN`;
//         const bookdata = await db.runQuery(query, [userID]);
//         const dp = await db.runQuery(`SELECT IMAGE
//                                 FROM USERS
//                                 WHERE USERID = :userID`,[userID]);
        
//         res.render('explore', { bookdata: bookdata ,dp});
//     } catch (error) {
//         console.error('Error adding post:', error);
//         res.status(500).json({ success: false, message: 'Error adding post' });
//     }
// });



// async function checkUniqueUserID(ID) {
//     try {
//         const query =
//             `BEGIN
//            :count := check_unique_userid(:userID);
//         END;`;

//         const binds = {
//             userID: ID,
//             count: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
//         };
//         const result = await runProcFunc(query, binds);
//         console.log(result.outBinds);
//         if (result.outBinds.count == 0) return true;
//         else return false;
//     } catch (error) {
//         console.error('Error checking unique userID:', error);
//         return false;
//     }
// }

// app.post('/signup', upload.single('photo'), async (req, res) => {
//     const userID = req.body.userID;
//     req.session.userID = userID;
//     const fullName = req.body.fullName;
//     let email = '';
//     if (req.body.email) {
//         email = req.body.email;
//     }
//     let phone = '';
//     if (req.body.phone) {
//         phone = req.body.phone;
//     }
//     const address = req.body.address;
//     const rawPassword = req.body.password;
//     let photoURL = '';
//     if (req.file) {
//         photoURL = `/Images/${userID}/${req.file.filename}`;
//     }
//     else {
//         photoURL = 'https://www.seekpng.com/png/detail/41-410093_circled-user-icon-user-profile-icon-png.png';
//     }
//     const saltRounds = 10;

//     console.log('Received data from client:');
//     console.log('userID:', userID);
//     console.log('fullName:', fullName);
//     console.log('email:', email);
//     console.log('phone:', phone);

//     const isUnique = await checkUniqueUserID(userID);
//     if (!isUnique) {
//         return res.status(400).json({ success: false, message: 'UserID is already taken' });
//     }

//     console.log('Hashing the password...');
//     try {
//         const hashedPassword = await bcrypt.hash(rawPassword, saltRounds);
//         console.log('Hashed password:', hashedPassword);

//         const query = `
//           INSERT INTO Users(userID, Name, email, phone, address, Password, Image, rawPassword)
//           VALUES(:userID, :fullName, :email, :phone, :address, :hashedPassword, :photoURL, :rawPassword)`;

//         console.log('Executing query:', query);
//         await runQuery(query, [userID, fullName, email, phone, address, hashedPassword, photoURL, rawPassword]);

//         console.log('User signed up successfully!');
//         res.json({ success: true, message: 'Signup successful' });
//     } catch (error) {
//         console.error('Error hashing password:', error);
//         res.status(500).json({ success: false, message: 'Error signing up!' });
//     }
// });

// app.post('/editrequest', async (req, res) => {
//     const userID = req.body.userID;
//     // req.session.userID = userID;
//     const oldID = req.session.userID;
//     const fullName = req.body.fullName;
//     let email = '';
//     if (req.body.email) {
//         email = req.body.email;
//     }
//     let phone = '';
//     if (req.body.phone) {
//         phone = req.body.phone;
//     }
//     const address = req.body.address;
//     const rawPassword = req.body.password;
//     let photoURL = '';
//     if(req.body.photo){
//         photoURL = req.body.photo;
//     }
//     const saltRounds = 10;

//     console.log('Received data from client:');
//     console.log('userID:', userID);
//     console.log('fullName:', fullName);
//     console.log('email:', email);
//     console.log('phone:', phone);

//     const isUnique = await checkUniqueUserID(userID);
//     if (!isUnique) {
//         return res.status(400).json({ success: false, message: 'UserID is already taken' });
//     }

//     console.log('Hashing the password...');
//     try {
//         const hashedPassword = await bcrypt.hash(rawPassword, saltRounds);
//         console.log('Hashed password:', hashedPassword);

//         // const query = `
//         //   INSERT INTO Users(userID, Name, email, phone, address, Password, Image, rawPassword)
//         //   VALUES(:userID, :fullName, :email, :phone, :address, :hashedPassword, :photoURL, :rawPassword)`;

//         const query = `UPDATE Users
//                         SET UserID = :userID , Name = :fullName, Email = :email, Phone = :phone, Address = :address,
//                         Password = :hashedPassword, Image = :photoURL, rawPassword = :rawPassword
//                         WHERE UserID = :oldID`;

//         console.log('Executing query:', query);
//         await runQuery(query, [userID, fullName, email, phone, address, hashedPassword, photoURL, rawPassword, oldID]);
//         req.session.userID = userID;
//         console.log('User signed up successfully!');
//         res.json({ success: true, message: 'Edit User Info successful' });
//     } catch (error) {
//         console.error('Error hashing password:', error);
//         res.status(500).json({ success: false, message: 'Error Edit User Info!' });
//     }
// });

// app.get('/deleterequest', async (req, res) => {
//     const userID = req.session.userID;

//     try {
//         const query =
//             `DELETE FROM USERS
//             WHERE UserID = :userID`;
//         await runQuery(query, [userID]);

//         res.json({ success: true, message: 'Deleted user successfully' });
//     } catch (error) {
//         console.error('Error adding post:', error);
//         res.status(500).json({ success: false, message: 'Error adding post' });
//     }
// });

// app.get('/', async (req, res) => {
//     try {
//         const bookCountResult = await runQuery("SELECT COUNT(*) FROM OwnedBy", []);
//         const bookCount = bookCountResult[0][0];
//         const userCountResult = await runQuery("SELECT COUNT(*) FROM Users", []);
//         const userCount = userCountResult[0][0];
//         const postCountResult = await runQuery("SELECT COUNT(*) FROM Blog",[]);
//         const postCount = postCountResult[0][0];
//         const transactionCountResult = await runQuery("SELECT COUNT(*) FROM Requests",[]);
//         const transactionCount = transactionCountResult[0][0];

//         // Render the EJS template and pass productCount as data
//         res.render("index", { bookCount, userCount, postCount, transactionCount });
//     } catch (error) {
//         console.error("Error fetching productCount:", error);
//         res.status(500).send("Internal Server Error");
//     }
// });

async function getUserPasswordByID(ID) {
    try {
        const query =
            `BEGIN
           :password := get_hashed_password_by_userid(:userID);
        END;`;

        const binds = {
            userID: ID,
            password: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
        };

        const result = await runProcFunc(query, binds);
        console.log(result.outBinds);
        return result.outBinds.password;
    } catch (error) {
        console.error('Error fetchig password:', error);
        throw error;
    }
}

// app.get('/login/:userID/:password', async (req, res) => {
//     const userID = req.params.userID;
//     const rawPassword = req.params.password;
//     req.session.userID = req.params.userID;
//     //Write function in SQL
//     try {
//         const hashedPassword = await getUserPasswordByID(userID);
//         if (!hashedPassword) {
//             return res.json({ success: false, message: 'User not found' });
//         }

//         const passwordMatch = await bcrypt.compare(rawPassword, hashedPassword);
//         if (passwordMatch) {
//             return res.json({ success: true, message: 'Login successful' });
//         } else {
//             return res.json({ success: false, message: 'Incorrect password' });
//         }
//     } catch (error) {
//         console.error('Error logging in:', error);
//         res.status(500).json({ success: false, message: 'Error logging in' });
//     }
// });

// app.get('/editUser', async (req,res) =>{
//     const userID = req.session.userID;
//     if(userID) {
//         try {
//             const data = await runQuery(`SELECT UserID, Name, Email, Phone, Address, Image, RawPassword
//             FROM Users WHERE UserID = :userID`,[userID]);
//             if (data.length > 0) {
//                 const user = data[0];
//                 const userObject = {
//                     userID: user[0],
//                     name: user[1],
//                     email: user[2],
//                     phone: user[3],
//                     address: user[4],
//                     image: user[5],
//                     rawPassword: user[6]
//                 };
//                 res.render('editUser', { user: userObject}); 
//             }
//         } catch(error) {
//             console.error('Error:', error);
//             res.status(500).json({ error: 'An error occurred' });
//         }
//     }
//     else
//     {
//         res.redirect('/');
//     }
// });

// async function checkMaxBook(ID) {
//     try {
//         const query =
//             `DECLARE
//             MSG VARCHAR2(10);
//         BEGIN
//             check_max_book(:userID, :MSG);
//         END;`;

//         const binds = {
//             userID: ID,
//             MSG: { dir: oracledb.BIND_OUT, type: oracledb.DB_TYPE_VARCHAR }
//         };
//         const result = await runProcFunc(query, binds);
        
//         if (result.outBinds.MSG == 'yes') return true;
//         else return false;
//     } catch (error) {
//         console.error('Error checking max books?:', error);
//         return false;
//     }
// }

// async function checkMaxPost(ID) {
//     try {
//         const query =
//             `DECLARE
//             MSG VARCHAR2(10);
//         BEGIN
//             check_max_post(:userID, :MSG);
//         END;`;

//         const binds = {
//             userID: ID,
//             MSG: { dir: oracledb.BIND_OUT, type: oracledb.DB_TYPE_VARCHAR }
//         };
//         const result = await runProcFunc(query, binds);
        
//         if (result.outBinds.MSG == 'yes') return true;
//         else return false;
//     } catch (error) {
//         console.error('Error checking max posts?:', error);
//         return false;
//     }
// }

// async function checkMaxTransaction(ID) {
//     try {
//         const query =
//             `DECLARE
//             MSG VARCHAR2(10);
//         BEGIN
//             check_max_transaction(:userID, :MSG);
//         END;`;

//         const binds = {
//             userID: ID,
//             MSG: { dir: oracledb.BIND_OUT, type: oracledb.DB_TYPE_VARCHAR }
//         };
//         const result = await runProcFunc(query, binds);
//         if (result.outBinds.MSG == 'yes') return true;
//         else return false;
//     } catch (error) {
//         console.error('Error checking max transactions?:', error);
//         return false;
//     }
// }

// app.get('/dashboard', async (req, res) => {
//     const userID = req.session.userID;

//     if (userID) {
//         try {
//             const data = await runQuery(`SELECT UserID, Name, Email, Phone, Address, Image
//                 FROM Users WHERE UserID = :userID`, [userID]);
//             const blog = await runQuery(
//                 `SELECT U.Name, U.Image, T.Post, time_difference(T.Timestamp) AS Time_difference
//             FROM USERS U , (SELECT Writer, Post, Timestamp
//                             FROM POSTEDBY P JOIN BLOG B
//                             ON P.PostID = B.PostID
//                             ORDER BY P.PostID) T
//             WHERE U.UserID = T.Writer`, []);
//             // console.log("Data: ", data);
//             // console.log(blog);
//             if (data.length > 0) {
//                 const user = data[0];
//                 const userObject = {
//                     userID: user[0],
//                     name: user[1],
//                     email: user[2],
//                     phone: user[3],
//                     address: user[4],
//                     image: user[5]
//                 };
//             const bookCountresult = await runQuery(`SELECT COUNT(*) FROM OwnedBy WHERE Owner = :userID`,[userID]);
//             const bookCount = bookCountresult[0][0];
//             const postCountresult = await runQuery(`SELECT COUNT(*) FROM PostedBy WHERE Writer = :userID`,[userID]);
//             const postCount = postCountresult[0][0];
//             const transactionCountResult = await runQuery(`SELECT COUNT(*) FROM Requests WHERE BUYER_ID = :userID OR SELLER_ID = :userID`,
//             [userID,userID]);
//             const transactionCount = transactionCountResult[0][0];

//             var textB = '';
//             if(await checkMaxBook(userID) == true)
//             {
//                 textB = 'Highest till now';
//             }
//             var textP = '';
//             if(await checkMaxPost(userID) == true)
//             {
//                 textP = 'Highest till now';
//             }
//             var textT = '';
//             if(await checkMaxTransaction(userID) == true)
//             {
//                 textT = 'Highest till now';
//             }
//             res.render('dashboard', { user: userObject, blog: blog, bookCount, postCount, transactionCount, textB, textP, textT});
//             } else {
//                 res.status(404).json({ error: 'User not found' });
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             res.status(500).json({ error: 'An error occurred' });
//         }
//     } else {
//         // User is not authenticated, redirect to login
//         res.redirect('/');
//     }
// });

// app.post('/addpost', async (req, res) => {
//     const userID = req.session.userID;
//     const postContent = req.body.content;
//     console.log(postContent);

//     try {
//         const query1 =
//             `INSERT INTO Blog(PostID, Post)
//          VALUES(POST_NUMBER_INCREMENTOR.NEXTVAL, :postContent)`;
//         await runQuery(query1, [postContent]);

//         const query2 =
//             `INSERT INTO PostedBy(PostID, Writer)
//          VALUES(POST_NUMBER_INCREMENTOR.CURRVAL, :userID)`;
//         await runQuery(query2, [userID]);

//         res.json({ success: true, message: 'Post added successfully' });
//     } catch (error) {
//         console.error('Error adding post:', error);
//         res.status(500).json({ success: false, message: 'Error adding post' });
//     }
// });

// app.get('/explore', async (req, res) => {
//     const userID = req.session.userID;
//     try {


//         const query =
//             `SELECT T1.NAME, T1.EMAIL, T1.PHONE, T1.ADDRESS, T1.IMAGE, T1.BOOKISBN, B.TITLE, B.PUBLISHYEAR, B.DESCRIPTION, T1.PRICE, T1.GENRE1, T1.GENRE2, T1.GENRE3, T1.COVER,
//         W.AUTHOR, W.URL, W.EMAIL, W.DESCRIPTION, W.IMAGE, P.PUBLISHER, P.URL, P.EMAIL, P.ADDRESS, P.DESCRIPTION, P.LOGO
//   FROM (SELECT NAME, EMAIL, PHONE, ADDRESS, IMAGE, PRICE, COVER, BOOKISBN, GENRE1, GENRE2, GENRE3
//         FROM USERS JOIN OWNEDBY ON (USERS.USERID = OWNEDBY.OWNER)
//         WHERE USERS.USERID <> :userID) T1, BOOKS B,
//                    (SELECT BOOKISBN, AUTHOR, URL, IMAGE, EMAIL, DESCRIPTION
//                     FROM AUTHORS JOIN WRITTENBY ON (AUTHORS.AUTHORNAME = WRITTENBY.AUTHOR)) W,
//                    (SELECT BOOKISBN, PUBLISHER, EMAIL, LOGO, URL, DESCRIPTION, ADDRESS
//                     FROM PUBLISHERS JOIN PUBLISHEDBY ON (PUBLISHERS.PUBLISHERNAME = PUBLISHEDBY.PUBLISHER)) P
// WHERE T1.BOOKISBN = B.ISBN
// AND T1.BOOKISBN = W.BOOKISBN
// AND T1.BOOKISBN = P.BOOKISBN`;

//         const bookdata = await runQuery(query, [userID]);
//         const dp = await runQuery(`SELECT IMAGE
//                                 FROM USERS
//                                 WHERE USERID = :userID`, [userID]);



//         res.render('explore', { bookdata: bookdata, dp });
//     } catch (error) {
//         console.error('Error adding post:', error);
//         res.status(500).json({ success: false, message: 'Error adding post' });
//     }
// });

// app.get('/mybooks', async (req, res) => {
//     const userID = req.session.userID;
//     try {
//         const query =
//         `SELECT T1.NAME, T1.EMAIL, T1.PHONE, T1.ADDRESS, T1.IMAGE, T1.BOOKISBN, B.TITLE, B.PUBLISHYEAR, B.DESCRIPTION, T1.PRICE, T1.GENRE1, T1.GENRE2, T1.GENRE3, T1.COVER,
//         W.AUTHOR, W.URL, W.EMAIL, W.DESCRIPTION, W.IMAGE, P.PUBLISHER, P.URL, P.EMAIL, P.ADDRESS, P.DESCRIPTION, P.LOGO
//   FROM (SELECT NAME, EMAIL, PHONE, ADDRESS, IMAGE, PRICE, COVER, BOOKISBN, GENRE1, GENRE2, GENRE3
//         FROM USERS JOIN OWNEDBY ON (USERS.USERID = OWNEDBY.OWNER)
//         WHERE USERS.USERID = :userID) T1, BOOKS B,
//                    (SELECT BOOKISBN, AUTHOR, URL, IMAGE, EMAIL, DESCRIPTION
//                     FROM AUTHORS JOIN WRITTENBY ON (AUTHORS.AUTHORNAME = WRITTENBY.AUTHOR)) W,
//                    (SELECT BOOKISBN, PUBLISHER, EMAIL, LOGO, URL, DESCRIPTION, ADDRESS
//                     FROM PUBLISHERS JOIN PUBLISHEDBY ON (PUBLISHERS.PUBLISHERNAME = PUBLISHEDBY.PUBLISHER)) P
// WHERE T1.BOOKISBN = B.ISBN
// AND T1.BOOKISBN = W.BOOKISBN
// AND T1.BOOKISBN = P.BOOKISBN`;
//         const bookdata = await runQuery(query, [userID]);
//         const dp = await runQuery(`SELECT IMAGE
//                                 FROM USERS
//                                 WHERE USERID = :userID`, [userID]);

//         res.render('mybooks', { bookdata: bookdata, dp });
//     } catch (error) {
//         console.error('Error adding post:', error);
//         res.status(500).json({ success: false, message: 'Error adding post' });
//     }
// });

// app.get('/search', async (req, res) => {
//     const userID = req.session.userID;
//     const searchTerm = '';
//     const filterOption = 'none';
//     try {
//         const query =
//         `SELECT T1.NAME, T1.EMAIL, T1.PHONE, T1.ADDRESS, T1.IMAGE, T1.BOOKISBN, B.TITLE, B.PUBLISHYEAR, B.DESCRIPTION, T1.PRICE, T1.GENRE1, T1.GENRE2, T1.GENRE3, T1.COVER,
//         W.AUTHOR, W.URL, W.EMAIL, W.DESCRIPTION, W.IMAGE, P.PUBLISHER, P.URL, P.EMAIL, P.ADDRESS, P.DESCRIPTION, P.LOGO, T1.USERID
//   FROM (SELECT NAME, EMAIL, PHONE, ADDRESS, IMAGE, PRICE, COVER, BOOKISBN, GENRE1, GENRE2, GENRE3, USERID
//         FROM USERS JOIN OWNEDBY ON (USERS.USERID = OWNEDBY.OWNER)) T1, BOOKS B,
//                    (SELECT BOOKISBN, AUTHOR, URL, IMAGE, EMAIL, DESCRIPTION
//                     FROM AUTHORS JOIN WRITTENBY ON (AUTHORS.AUTHORNAME = WRITTENBY.AUTHOR)) W,
//                    (SELECT BOOKISBN, PUBLISHER, EMAIL, LOGO, URL, DESCRIPTION, ADDRESS
//                     FROM PUBLISHERS JOIN PUBLISHEDBY ON (PUBLISHERS.PUBLISHERNAME = PUBLISHEDBY.PUBLISHER)) P
// WHERE T1.BOOKISBN = B.ISBN
// AND T1.BOOKISBN = W.BOOKISBN
// AND T1.BOOKISBN = P.BOOKISBN`;
//         const bookdata = await runQuery(query, []);
//         const dp = await runQuery(`SELECT IMAGE
//                                 FROM USERS
//                                 WHERE USERID = :userID`, [userID]);

//         res.render('search', { bookdata: bookdata, dp, searchTerm, filterOption, userID});
//     } catch (error) {
//         console.error('Error adding post:', error);
//         res.status(500).json({ success: false, message: 'Error adding post' });
//     }
// });


// app.get('/search/:searchTerm/:filterOption',async (req,res) =>{
//     const searchTerm = req.params.searchTerm.toLowerCase();
//     const filterOption = req.params.filterOption;
//     const userID = req.session.userID;

//     console.log(searchTerm);
//     console.log(filterOption);

//     var query ='';
// try {
//     if(filterOption === 'genre'){
//         query = 
//         `SELECT T1.NAME, T1.EMAIL, T1.PHONE, T1.ADDRESS, T1.IMAGE, T1.BOOKISBN, B.TITLE, B.PUBLISHYEAR, B.DESCRIPTION, T1.PRICE, T1.GENRE1, T1.GENRE2, T1.GENRE3, T1.COVER,
//         W.AUTHOR, W.URL, W.EMAIL, W.DESCRIPTION, W.IMAGE, P.PUBLISHER, P.URL, P.EMAIL, P.ADDRESS, P.DESCRIPTION, P.LOGO, T1.USERID
//   FROM (SELECT NAME, EMAIL, PHONE, ADDRESS, IMAGE, PRICE, COVER, BOOKISBN, GENRE1, GENRE2, GENRE3, USERID
//         FROM USERS JOIN OWNEDBY ON (USERS.USERID = OWNEDBY.OWNER)) T1, BOOKS B,
//                    (SELECT BOOKISBN, AUTHOR, URL, IMAGE, EMAIL, DESCRIPTION
//                     FROM AUTHORS JOIN WRITTENBY ON (AUTHORS.AUTHORNAME = WRITTENBY.AUTHOR)) W,
//                    (SELECT BOOKISBN, PUBLISHER, EMAIL, LOGO, URL, DESCRIPTION, ADDRESS
//                     FROM PUBLISHERS JOIN PUBLISHEDBY ON (PUBLISHERS.PUBLISHERNAME = PUBLISHEDBY.PUBLISHER)) P
// WHERE T1.BOOKISBN = B.ISBN
// AND T1.BOOKISBN = W.BOOKISBN
// AND T1.BOOKISBN = P.BOOKISBN
// AND ((LOWER(T1.GENRE1) LIKE :searchTerm) OR (LOWER(T1.GENRE2) LIKE :searchTerm) OR (LOWER(T1.GENRE3) LIKE :searchTerm))`;

// const bookdata = await runQuery(query, [`%${searchTerm}%`,`%${searchTerm}%`,`%${searchTerm}%`]);
// const dp = await runQuery(`SELECT IMAGE
//                         FROM USERS
//                         WHERE USERID = :userID`, [userID]);
//     res.render('search', { bookdata: bookdata, dp, searchTerm, filterOption, userID });
//     }

//     else if(filterOption === 'author'){
//         query = 
//         `SELECT T1.NAME, T1.EMAIL, T1.PHONE, T1.ADDRESS, T1.IMAGE, T1.BOOKISBN, B.TITLE, B.PUBLISHYEAR, B.DESCRIPTION, T1.PRICE, T1.GENRE1, T1.GENRE2, T1.GENRE3, T1.COVER,
//         W.AUTHOR, W.URL, W.EMAIL, W.DESCRIPTION, W.IMAGE, P.PUBLISHER, P.URL, P.EMAIL, P.ADDRESS, P.DESCRIPTION, P.LOGO, T1.USERID
//   FROM (SELECT NAME, EMAIL, PHONE, ADDRESS, IMAGE, PRICE, COVER, BOOKISBN, GENRE1, GENRE2, GENRE3, USERID
//         FROM USERS JOIN OWNEDBY ON (USERS.USERID = OWNEDBY.OWNER)) T1, BOOKS B,
//                    (SELECT BOOKISBN, AUTHOR, URL, IMAGE, EMAIL, DESCRIPTION
//                     FROM AUTHORS JOIN WRITTENBY ON (AUTHORS.AUTHORNAME = WRITTENBY.AUTHOR)) W,
//                    (SELECT BOOKISBN, PUBLISHER, EMAIL, LOGO, URL, DESCRIPTION, ADDRESS
//                     FROM PUBLISHERS JOIN PUBLISHEDBY ON (PUBLISHERS.PUBLISHERNAME = PUBLISHEDBY.PUBLISHER)) P
// WHERE T1.BOOKISBN = B.ISBN
// AND T1.BOOKISBN = W.BOOKISBN
// AND T1.BOOKISBN = P.BOOKISBN
// AND (LOWER(W.AUTHOR) LIKE :searchTerm)`;

// const bookdata = await runQuery(query, [`%${searchTerm}%`]);
// const dp = await runQuery(`SELECT IMAGE
//                         FROM USERS
//                         WHERE USERID = :userID`, [userID]);
//     res.render('search', { bookdata: bookdata, dp,searchTerm, filterOption, userID });
//     } 

//     else if(filterOption === 'title'){
//         query = 
//         `SELECT T1.NAME, T1.EMAIL, T1.PHONE, T1.ADDRESS, T1.IMAGE, T1.BOOKISBN, B.TITLE, B.PUBLISHYEAR, B.DESCRIPTION, T1.PRICE, T1.GENRE1, T1.GENRE2, T1.GENRE3, T1.COVER,
//         W.AUTHOR, W.URL, W.EMAIL, W.DESCRIPTION, W.IMAGE, P.PUBLISHER, P.URL, P.EMAIL, P.ADDRESS, P.DESCRIPTION, P.LOGO, T1.USERID
//   FROM (SELECT NAME, EMAIL, PHONE, ADDRESS, IMAGE, PRICE, COVER, BOOKISBN, GENRE1, GENRE2, GENRE3, USERID
//         FROM USERS JOIN OWNEDBY ON (USERS.USERID = OWNEDBY.OWNER)) T1, BOOKS B,
//                    (SELECT BOOKISBN, AUTHOR, URL, IMAGE, EMAIL, DESCRIPTION
//                     FROM AUTHORS JOIN WRITTENBY ON (AUTHORS.AUTHORNAME = WRITTENBY.AUTHOR)) W,
//                    (SELECT BOOKISBN, PUBLISHER, EMAIL, LOGO, URL, DESCRIPTION, ADDRESS
//                     FROM PUBLISHERS JOIN PUBLISHEDBY ON (PUBLISHERS.PUBLISHERNAME = PUBLISHEDBY.PUBLISHER)) P
// WHERE T1.BOOKISBN = B.ISBN
// AND T1.BOOKISBN = W.BOOKISBN
// AND T1.BOOKISBN = P.BOOKISBN
// AND (LOWER(B.TITLE) LIKE :searchTerm)`;

// const bookdata = await runQuery(query, [`%${searchTerm}%`]);
// const dp = await runQuery(`SELECT IMAGE
//                         FROM USERS
//                         WHERE USERID = :userID`, [userID]);
//     res.render('search', { bookdata: bookdata, dp, searchTerm, filterOption, userID });
//     } 

//     else if(filterOption === 'none'){
//         query = 
//         `SELECT T1.NAME, T1.EMAIL, T1.PHONE, T1.ADDRESS, T1.IMAGE, T1.BOOKISBN, B.TITLE, B.PUBLISHYEAR, B.DESCRIPTION, T1.PRICE, T1.GENRE1, T1.GENRE2, T1.GENRE3, T1.COVER,
//         W.AUTHOR, W.URL, W.EMAIL, W.DESCRIPTION, W.IMAGE, P.PUBLISHER, P.URL, P.EMAIL, P.ADDRESS, P.DESCRIPTION, P.LOGO, T1.USERID
//   FROM (SELECT NAME, EMAIL, PHONE, ADDRESS, IMAGE, PRICE, COVER, BOOKISBN, GENRE1, GENRE2, GENRE3, USERID
//         FROM USERS JOIN OWNEDBY ON (USERS.USERID = OWNEDBY.OWNER)) T1, BOOKS B,
//                    (SELECT BOOKISBN, AUTHOR, URL, IMAGE, EMAIL, DESCRIPTION
//                     FROM AUTHORS JOIN WRITTENBY ON (AUTHORS.AUTHORNAME = WRITTENBY.AUTHOR)) W,
//                    (SELECT BOOKISBN, PUBLISHER, EMAIL, LOGO, URL, DESCRIPTION, ADDRESS
//                     FROM PUBLISHERS JOIN PUBLISHEDBY ON (PUBLISHERS.PUBLISHERNAME = PUBLISHEDBY.PUBLISHER)) P
// WHERE T1.BOOKISBN = B.ISBN
// AND T1.BOOKISBN = W.BOOKISBN
// AND T1.BOOKISBN = P.BOOKISBN
// AND ((LOWER(W.AUTHOR) LIKE :searchTerm) OR (LOWER(B.TITLE) LIKE :searchTerm) OR 
// (LOWER(T1.GENRE1) LIKE :searchTerm) OR (LOWER(T1.GENRE2) LIKE :searchTerm) OR (LOWER(T1.GENRE3) LIKE :searchTerm))`;

// const bookdata = await runQuery(query, [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]);
// const dp = await runQuery(`SELECT IMAGE
//                         FROM USERS
//                         WHERE USERID = :userID`, [userID]);
//     res.render('search', { bookdata: bookdata, dp, searchTerm, filterOption, userID });
//     } 

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: 'Error adding post' });
//     }

// });

process.on('SIGINT', async () => {
    await db.closeConnection();
    console.log('Database closed');
    process.exit();
});
