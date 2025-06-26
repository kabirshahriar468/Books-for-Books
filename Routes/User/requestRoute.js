var express = require("express");
var router = express.Router();
// const bcrypt = require('bcrypt');
const oracledb = require('oracledb');
const multer = require('multer');
const session = require('express-session');
const path = require('path');
const fs = require('fs/promises');

const db = require('../../db');

router.post('/buy', async (req, res) => {

    //     INSERT INTO REQUESTS(BUYER_ID,SELLER_ID,REQUESTED_ISBN,BUY_PRICE,REQ_ID)
    // VALUES(')
    try {
        const buyerId = req.body.buyer;
        const sellerId = req.body.seller;
        const buyPrice = req.body.price;
        const requestedIsbn = req.body.isbn;


        const query1 = `SELECT COUNT(*) FROM REQUESTS
        WHERE REQUESTED_ISBN=:requestedIsbn AND SELLER_ID=:sellerId AND BUYER_ID=:buyerId `;
        const result = await db.runQuery(query1, [requestedIsbn, sellerId, buyerId]);



        if (result[0][0] == 0) {
            const query = `INSERT INTO REQUESTS(BUYER_ID,SELLER_ID,REQUESTED_ISBN,BUY_PRICE,REQ_ID)
                VALUES(:buyerId,:sellerId,:requestedIsbn,:buyPrice,REQUEST_ID_SEQ.NEXTVAL)`;
            await db.runQuery(query, [buyerId, sellerId, requestedIsbn, buyPrice]);


            res.json({ success: 'sent', message: 'Buy request sent successfully..' });
        } else {
            res.json({ success: 'requested', message: 'Buy request sent successfully..' });
        }
        
    } catch (error) {
        res.status(500).json({ success:'error', message: 'Error Sending Buy Request!!' });

    }
});

router.post('/exchange', async (req, res) => {
    try {
        const buyerId = req.body.buyer;
        const sellerId = req.body.seller;
        const exchangeIsbn = req.body.giveisbn;
        const requestedIsbn = req.body.takeisbn;

        console.log("vals:  "+buyerId+" "+sellerId+" "+exchangeIsbn+"  "+requestedIsbn);
        const query1 = `SELECT COUNT(*) FROM REQUESTS
        WHERE REQUESTED_ISBN=:requestedIsbn AND SELLER_ID=:sellerId AND BUYER_ID=:buyerId `;
        const result = await db.runQuery(query1, [requestedIsbn, sellerId, buyerId]);

        console.log("inside exchange rout="+result[0][0]);

        if (result[0][0] == 0) {
            const query = `INSERT INTO REQUESTS(BUYER_ID,SELLER_ID,REQUESTED_ISBN,EXCHANGE_ISBN,REQ_ID)
                VALUES(:buyerId,:sellerId,:requestedIsbn,:exchangeIsbn,REQUEST_ID_SEQ.NEXTVAL)`;
            await db.runQuery(query, [buyerId, sellerId, requestedIsbn, exchangeIsbn]);


            res.json({ success: 'sent', message: 'Buy request sent successfully..' });
        } else {
            res.json({ success: 'requested', message: 'Buy request sent successfully..' });
        }
        
    } catch (error) {
        res.status(500).json({ success:'error', message: 'Error Sending Buy Request!!' });

    }

});
router.get('/getISBN',async(req,res)=>{
    const usercurr=req.session.userID;
    console.log("REQUESTS [][][]"+usercurr);
    try {
        const query=`SELECT BOOKISBN FROM OWNEDBY WHERE OWNER=:usercurr`;
        const isbnArr = await db.runQuery(query, [usercurr]);
        console.log(isbnArr);
        
        if (isbnArr) {
            return res.json({ success: isbnArr, message: 'User  found' });
        } else {
            return res.json({ success: null, message: 'No ISBN number found' })
        }


    } catch (error) {
        console.error('Error Getting ISBN numbers from server:', error);
        res.status(500).json({ success: false, message: 'Error Getting ISBN numbers from server' });
    }
});

module.exports = router;
