var express = require("express");
var router = express.Router();
// const bcrypt = require('bcrypt');
const oracledb = require('oracledb');
const session = require('express-session');

const db =require('../../db');

router.post('/',async (req,res)=>{
    const userID = req.session.userID;
    const postContent = req.body.content;
    console.log(postContent);

    try {
        const query1 = 
        `INSERT INTO Blog(PostID, Post)
         VALUES(POST_NUMBER_INCREMENTOR.NEXTVAL, :postContent)`;
        await db.runQuery(query1, [postContent]);

        const query2 = 
        `INSERT INTO PostedBy(PostID, Writer)
         VALUES(POST_NUMBER_INCREMENTOR.CURRVAL, :userID)`;
        await db.runQuery(query2, [userID]);
        
        res.json({ success: true, message: 'Post added successfully' });
    } catch (error) {
        console.error('Error adding post:', error);
        res.status(500).json({ success: false, message: 'Error adding post' });
    }
});
module.exports=router;