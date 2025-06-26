var express = require("express");
var router = express.Router();



// route for logout
router.get('/', (req ,res)=>{
    console.log("logging out....");
    req.session.destroy(function(err){
        if(err){
            console.log(err);
            res.send("Error")
        }else{

            console.log("logging out successfully....");

            res.redirect('/');
        }
    })
})
console.log("ber hocchi...");

module.exports = router;