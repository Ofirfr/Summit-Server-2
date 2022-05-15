//Anything related to coaches will be here
const router = require("express").Router();
const {check,validationResult} = require('express-validator');
const JWT = require("jsonwebtoken")
const bcrypt = require('bcrypt');


//Login 
// Get username and password, check if is good in db and return jwt
router.post("/Login",[
    check("password","Password must be atleast 6 characters")
    .isLength({min:6}),
    check("coach","Coach name must be at least 2 characters")
    .isLength({min:2})
    ],
    async (req,res)=>{
    const {coach,password} =req.body;

    //Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        });
    }



    return res.send('HI')
    
});


//Add coach


module.exports = router