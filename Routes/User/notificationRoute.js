var express = require("express");
var router = express.Router();
// const bcrypt = require('bcrypt');
const oracledb = require('oracledb');
const session = require('express-session');

const db = require('../../db');


router.get('/', async (req, res) => {
    const userID = req.session.userID;
    try {
        const queryBuy =
            `SELECT O.COVER,U.NAME,R.BUY_PRICE,B.TITLE,U.USERID,R.REQUESTED_ISBN
        FROM REQUESTS R 
        JOIN OWNEDBY O ON R.SELLER_ID=O.OWNER AND R.REQUESTED_ISBN=O.BOOKISBN
        JOIN BOOKS B ON O.BOOKISBN=B.ISBN
        JOIN USERS U ON R.BUYER_ID=U.USERID
        WHERE R.SELLER_ID=:userID AND R.BUY_PRICE IS NOT NULL`;
        const queryExchange = `SELECT O1.COVER,U1.NAME,B1.TITLE,O2.COVER,B2.TITLE,R.BUYER_ID,R.REQUESTED_ISBN,R.EXCHANGE_ISBN
        FROM REQUESTS R 
        JOIN OWNEDBY O1 ON R.SELLER_ID=O1.OWNER AND R.REQUESTED_ISBN=O1.BOOKISBN
        JOIN OWNEDBY O2 ON R.BUYER_ID=O2.OWNER AND R.EXCHANGE_ISBN=O2.BOOKISBN
        JOIN BOOKS B2 ON O2.BOOKISBN=B2.ISBN
        JOIN BOOKS B1 ON O1.BOOKISBN=B1.ISBN
        JOIN USERS U1 ON R.BUYER_ID=U1.USERID
        WHERE R.SELLER_ID=:userID AND R.BUY_PRICE IS  NULL`
        const sellBooks = await db.runQuery(queryBuy, [userID]);
        const exchangeBooks = await db.runQuery(queryExchange, [userID]);

        const dp = await db.runQuery(`SELECT IMAGE
                                FROM USERS
                                WHERE USERID = :userID`, [userID]);
        const notificationCnt=await db.runQuery(`SELECT COUNT(*) FROM REQUESTS WHERE SELLER_ID=:userID`,[userID]);

        res.render('notifications', {sellBooks:sellBooks, dp, exchangeBooks:exchangeBooks,sellerId:userID,notificationCnt:notificationCnt});
    } catch (error) {
        console.error('Error adding post:', error);
        res.status(500).json({ success: false, message: 'Error adding post' });
    }
});


router.post('/sell', async (req, res) => {

    //     INSERT INTO REQUESTS(BUYER_ID,SELLER_ID,REQUESTED_ISBN,BUY_PRICE,REQ_ID)
    // VALUES(')
    try {
        const buyerId = req.body.buyer;
        const sellerId = req.body.seller;
        const requestedIsbn = req.body.isbn;


        const query1 = `SELECT ID FROM OWNEDBY
        WHERE BOOKISBN=:requestedIsbn AND OWNER=:sellerId  `;
        const result = await db.runQuery(query1, [requestedIsbn, sellerId]);

        const tmpId=result[0][0];
        const query=`UPDATE OWNEDBY SET OWNER=:buyerId WHERE ID=:tmpId`;
        await db.runQuery(query,[buyerId,tmpId]);

        const query2 = `SELECT COUNT(*) FROM OWNEDBY
        WHERE BOOKISBN=:requestedIsbn AND OWNER=:sellerId  `;
        const cnt = await db.runQuery(query2, [requestedIsbn, sellerId]);

        const querydelete=`DELETE FROM REQUESTS WHERE BUYER_ID=:buyerId AND SELLER_ID=:sellerId AND REQUESTED_ISBN=:requestedIsbn`;
        await db.runQuery(querydelete,[buyerId,sellerId,requestedIsbn]);
        if (cnt[0][0] == 0) {
            const query = `DELETE FROM REQUESTS WHERE REQ_ID=
                                    (SELECT REQ_ID FROM REQUESTS
                                    WHERE SELLER_ID=:sellerId AND REQUESTED_ISBN=:requestedIsbn
                                    UNION
                                    (SELECT REQ_ID FROM REQUESTS
                                    WHERE BUYER_ID=:sellerId AND EXCHANGE_ISBN=:requestedIsbn
                                    ))`;
            await db.runQuery(query, [sellerId, requestedIsbn,sellerId, requestedIsbn]);


        } 
        res.json({ success: 'sent', message: 'Sold successfully..' });

        
    } catch (error) {
        res.status(500).json({ success:'error', message: 'Error Selling this Book!!' });

    }
});

router.post('/exchange', async (req, res) => {

    //     INSERT INTO REQUESTS(BUYER_ID,SELLER_ID,REQUESTED_ISBN,BUY_PRICE,REQ_ID)
    // VALUES(')
    try {
        const buyerId = req.body.buyer;
        const sellerId = req.body.seller;
        const giveisbn = req.body.giveisbn;
        const takeisbn=req.body.takeisbn;


        let query1 = `SELECT ID FROM OWNEDBY
        WHERE BOOKISBN=:giveisbn AND OWNER=:sellerId  `;
        const result1 = await db.runQuery(query1, [giveisbn, sellerId]);

        const tmpId=result1[0][0];
        let query=`UPDATE OWNEDBY SET OWNER=:buyerId WHERE ID=:tmpId`;
        await db.runQuery(query,[buyerId,tmpId]);


        query1 = `SELECT ID FROM OWNEDBY
        WHERE BOOKISBN=:takeisbn AND OWNER=:buyerId  `;
        const result2 = await db.runQuery(query1, [takeisbn, buyerId]);

        const tmpId1=result2[0][0];
        query=`UPDATE OWNEDBY SET OWNER=:sellerId WHERE ID=:tmpId1`;
        await db.runQuery(query,[sellerId,tmpId1]);


        let query2 = `SELECT COUNT(*) FROM OWNEDBY
        WHERE BOOKISBN=:giveisbn AND OWNER=:sellerId  `;

        const querydelete=`DELETE FROM REQUESTS WHERE BUYER_ID=:buyerId AND SELLER_ID=:sellerId AND REQUESTED_ISBN=:giveisbn`;
        await db.runQuery(querydelete,[buyerId,sellerId,giveisbn]);

        let cnt = await db.runQuery(query2, [giveisbn, sellerId]);
        if (cnt[0][0] == 0) {
            const query = `DELETE FROM REQUESTS WHERE REQ_ID=
                                    (SELECT REQ_ID FROM REQUESTS
                                    WHERE SELLER_ID=:sellerId AND REQUESTED_ISBN=:giveisbn
                                    UNION
                                    (SELECT REQ_ID FROM REQUESTS
                                    WHERE BUYER_ID=:sellerId AND EXCHANGE_ISBN=:giveisbn
                                    ))`;
            await db.runQuery(query, [sellerId,giveisbn,sellerId,giveisbn]);


        }
        query2 = `SELECT COUNT(*) FROM OWNEDBY
        WHERE BOOKISBN=:takeisbn AND OWNER=:buyerId  `;
        cnt = await db.runQuery(query2, [takeisbn, buyerId]);
        if (cnt[0][0] == 0) {
            const query = `DELETE FROM REQUESTS WHERE REQ_ID=
                                    (SELECT REQ_ID FROM REQUESTS
                                    WHERE SELLER_ID=:buyerId AND REQUESTED_ISBN=:takeisbn
                                    UNION
                                    (SELECT REQ_ID FROM REQUESTS
                                    WHERE BUYER_ID=:buyerId AND EXCHANGE_ISBN=:takeisbn
                                    ))`;
            await db.runQuery(query, [buyerId, takeisbn,buyerId, takeisbn]);


        }
         
        res.json({ success: 'sent', message: 'Exchanged successfully..' });

        
    } catch (error) {
        res.status(500).json({ success:'error', message: 'Error exchanging this couple of book!!' });

    }
});


module.exports = router;
