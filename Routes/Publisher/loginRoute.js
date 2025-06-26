var express = require("express");
var router = express.Router();
const bcrypt = require('bcrypt');
const oracledb = require('oracledb');

const db =require('../../db');

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
            `SELECT PASSWORD FROM PUBLISHERS
            WHERE PUBLISHERNAME=:ID`;

        const result =await db.runQuery(query,[ID]);
        
        return result[0][0];
    } catch (error) {
        console.error('Error fetchig password:', error);
        throw error;
    }
}


console.log("dhuktesi login router....");

router.get('/:userID/:password',async (req, res)=>{
    console.log("inside login router....");
        const userID = req.params.userID;
        const rawPassword = req.params.password;
        req.session.userID = req.params.userID;
        //Write function in SQL
        try {
            const Password = await getUserPasswordByID(userID);
            if (!Password) {
                return res.json({ success: false, message: 'Publisher not found' });
            }
    
            //const passwordMatch = await bcrypt.compare(rawPassword, hashedPassword);
            if (Password==rawPassword) {
                return res.json({ success: true, message: 'Login successful' });
            } else {
                return res.json({ success: false, message: 'Incorrect password' });
            }
        } catch (error) {
            console.error('Error logging in:', error);
            res.status(500).json({ success: false, message: 'Error logging in' });
        }
});





module.exports = router;