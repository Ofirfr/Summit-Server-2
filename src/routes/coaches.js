//Anything related to coaches will be here
const router = require("express").Router();
const {check,validationResult} = require('express-validator');

const JWT = require("jsonwebtoken")
const bcrypt = require('bcrypt');
const checkAuth = require("./checkToken");

const {PrismaClient} = require('@prisma/client')
const {coach} =new PrismaClient();

const dotenv = require('dotenv');
dotenv.config();


//Login 
// Get username and password, check if is good in db and return jwt
router.post("/Login",
    async (req,res)=>{
    const {coachName,password} =req.body;

    hashedPassword = await bcrypt.hash(password,10);
    console.log(hashedPassword);
    const checkPassword = await coach.findFirst({
        where:{
            name:coachName,
        },
        select:{
            password:true
        }
    })
    if(!checkPassword){
        return res.status(400).json({
            errors:[{
                msg: "Coach doesnt exist"
            }]
        })
    }
    if(!(await bcrypt.compare(password,checkPassword.password))){
        return res.status(400).json({
            errors:[{
                msg: "Password doesnt match coach"
            }]
        })
    }

    const token = await JWT.sign({"name":coachName},process.env.secret,{expiresIn:3600})

    console.log(`Coach ${coachName} logged in`);
    return res.json({token})
    
});


// Add coach
// Only admin can add coach
router.post('/AddCoach',checkAuth,async (req,res)=>{
    //Check if user is admin
    const isAdmin = await coach.findFirst({
        where:{
            name:req.name,
            isAdmin:true
        }
    })
    if (!isAdmin){
        return res.status(400).json({
            errors:[{
                msg:"Must be admin to add coach"
            }]
        })
    }

    const {coachName,password} = req.body

    //Check credentials match requierment
    if(password.length<5){
        return res.status(400).json({
            errors:[{
                msg:"Password length must be at least 6"
            }]
        })
    }
    if(coachName.length<2){
        return res.status(400).json({
            errors:[{
                msg:"Name length must be at least 2"
            }]
        })
    }

    //Check coach doesnt exist
    const coachExists = await coach.findFirst({
        where:{
            name:coachName
        }
    })
    if(coachExists){
       return res.status(400).json({
        errors:[{
            msg:"Coach already exists"
        }]
       })
    }


    //Hash password and insert
    const hashedPassword = await bcrypt.hash(password,10);
    await coach.create({
        data:{
            name:coachName,
            password:hashedPassword
        }
    })
    console.log(`Coach ${coachName} added.`);
    return res.status(200).send(
        `Coach ${coachName} added.`
    )
})


module.exports = router