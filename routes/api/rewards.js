var router = require('express').Router();

router.post("/", validateData, rewardCalc);

function rewardCalc(req,res){
    res.status(201).json({
        status: "Received transactions"
    });
    // validate the data 
}


function validateData(req,res,next){
    next();
}

module.exports = router;