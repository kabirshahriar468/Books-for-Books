var express = require("express");
var router = express.Router();
const bcrypt = require('bcrypt');
const oracledb = require('oracledb');

const db =require('../../db');
//login user
// router.post('/login',async (req, res)=>{
//     // const userID = userIDInput.value;
//     // const password = passwordInput.value;
//     console.log("inside router");
//     // const userID =req.body.userID;
//     // const password = req.body.password;
//     console.log(req.body);
//     const { id, password } = req.body;
//     // const userID = document.getElementById("inputUserID");
//     // const password = document.getElementById("inputPassword");
//     console.log(userID);
//     console.log(password);
//     // Make an API request to your backend
//     try {
//         const response =  await fetch(`/login/${userID}/${password}`);
//         const data =await response.json();

//         if (data.success) {
//             // Redirect to a new page on successful login
//             //alert("Success");
//             req.session.user=userID;
//             await Swal.fire({
//                 icon: 'success',
//                 title: 'Log in successful!',
//                 showConfirmButton: false,
//                 background: '#e1f5c6',
//                 timer: 2500
//             })
//             console.log("Success!");
//             res.redirect('/route/dashboard');
//             //window.location.replace(`/dashboard.ejs?userID=${userID}`);
//         } else {
//             await Swal.fire({
//                 icon: 'error',
//                 title: 'Log in failed!',
//                 text: 'Wrong username or password',
//                 showConfirmButton: false,
//                 background: '#f5c6c6',
//                 timer: 2500
//             })
//             console.log('Login failed');
//         }
//     } catch (error) {
//         console.error('Error:', error);
//     }
// });
// async()=>{await db.connect();}
// const connection = db.getConnection();
// if(connection){
//     console.log("success");
// }else{
//     console.log("failes");
// }
async function runProcFunc(query, params) {
    const connection = db.getConnection();

    try {
        const result = await connection.execute(query, params);
        return result;
    } catch (error) {
        console.error('Error executing procedure/function:', error);
        throw error;
    }
}

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

        const result =await db.runProcFunc(query, binds);
        console.log(result.outBinds);
        return result.outBinds.password;
    } catch (error) {
        console.error('Error fetchig password:', error);
        throw error;
    }
}


// router.post('/',async (req, res)=>{
//     // const userID = userIDInput.value;
//     // const password = passwordInput.value;
//     console.log("inside router");
//     const userID =req.body.userID;
//     const password = req.body.password;
//     console.log(req.body);
   
    
//     // Make an API request to your backend
//     try {
//         const response = await fetch(`http://localhost:3000/Log-in/${userID}/${password}`);
//         const data =await response.json();

//         if (data.success) {
//             // Redirect to a new page on successful login
//             //alert("Success");
//             req.session.user=userID;
//             // await Swal.fire({
//             //     icon: 'success',
//             //     title: 'Log in successful!',
//             //     showConfirmButton: false,
//             //     background: '#e1f5c6',
//             //     timer: 2500
//             // })
//             console.log("Success!");
//             res.redirect('/login/dashboard');
//             //window.location.replace(`/dashboard.ejs?userID=${userID}`);
//         } else {
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Log in failed!',
//                 text: 'Wrong username or password',
//                 showConfirmButton: false,
//                 background: '#f5c6c6',
//                 timer: 2500
//             })
//             console.log('Login failed');
//         }
//     } catch (error) {
//         console.error('Error:', error);
//     }
// });
console.log("dhuktesi login router....");

router.get('/:userID/:password',async (req, res)=>{
    console.log("inside login router....");
        const userID = req.params.userID;
        const rawPassword = req.params.password;
        req.session.userID = req.params.userID;
        //Write function in SQL
        try {
            const hashedPassword = await getUserPasswordByID(userID);
            if (!hashedPassword) {
                return res.json({ success: false, message: 'User not found' });
            }
    
            const passwordMatch = await bcrypt.compare(rawPassword, hashedPassword);
            if (passwordMatch) {
                return res.json({ success: true, message: 'Login successful' });
            } else {
                return res.json({ success: false, message: 'Incorrect password' });
            }
        } catch (error) {
            console.error('Error logging in:', error);
            res.status(500).json({ success: false, message: 'Error logging in' });
        }
});

// router.get('/dashboard', (req, res) => {
//     if(req.session.user){
//         res.render('dashboard', {user : req.session.user})
//     }else{
//         res.send("Unauthorize User")
//     }
// })


// router.post('/login', (req, res)=>{
//     console.log(req.body);
//     //if(req.body. == credential.email && req.body.password == credential.password){
//         req.session.user = req.body.userID;
//         console.log(req.body.userID);
//         res.redirect('/route/dashboard');
//         //res.end("Login Successful...!");
    
// });




module.exports = router;