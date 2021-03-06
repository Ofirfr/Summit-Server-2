//Anything related to coaches will be here
const router = require("express").Router();

const JWT = require("jsonwebtoken")
const bcrypt = require('bcrypt');

const {PrismaClient} = require('@prisma/client')
const {coach} =new PrismaClient();

const dotenv = require('dotenv');
const checkToken = require('../util/checkToken')

dotenv.config();


//Login 
// Get username and password, check if is good in db and return jwt
router.post("/Login",
    async (req,res)=>{
    const {coachName,password} =req.body;

    // Check that all data was filled
    if (coachName==undefined||password==undefined){
        return res.status(400).json({
            errors:[{
                msg:"Please fill up all the data"
            }]
        })
    }

    // Get password of coach
    const coachInstance = await coach.findFirst({
        where:{
            coachName,
            active:true
        },
        select:{
            password:true,
            id:true,
            isAdmin:true
        }
    })
    // Not found = no coach instance, invalid
    if(!coachInstance){
        return res.status(400).json({
            errors:[{
                msg: "Invalid credentials"
            }]
        })
    }
    // Check if password matches
    if(!(await bcrypt.compare(password,coachInstance.password))){
        return res.status(400).json({
            errors:[{
                msg: "Invalid credentials"
            }]
        })
    }

    // Create jwt for the coach
    const token = JWT.sign({"name":coachName,"id":coachInstance.id,"isAdmin":coachInstance.isAdmin},process.env.secret)

    console.log(`Coach ${coachName} logged in.`);
    return res.json({token})
    
});

// Login with token -  for Remember me
router.post("/LoginWithToken",checkToken,
    async (req,res)=>{
    console.log(`Coach ${req.loggedCoach} logged in with token.`);
    res.status(200).send("OK");
});

// Add coach
// Only admin can add coach
router.post('/AddCoach',checkToken,async (req,res)=>{
    //Check if user is admin
    const adminCheck = req.isAdmin;
    if (!adminCheck){
        return res.status(400).json({
            errors:[{
                msg:"Must be admin to add coach"
            }]
        })
    }

    const {coachName,password,isAdmin} = req.body

    // Check that all data was filled
    if (coachName==undefined||password==undefined||isAdmin==undefined){
        return res.status(400).json({
            errors:[{
                msg:"Please fill up all the data"
            }]
        })
    }

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
            coachName
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
            coachName,
            password:hashedPassword,
            isAdmin
        }
    })
    console.log(`Coach ${coachName} added.`);
    return res.status(200).send(
        `Coach ${coachName} added.`
    )
})
router.get('/GetAllCoaches',checkToken,async (req,res)=>{
     //Check if user is admin
     const isAdmin = req.isAdmin;
     if (!isAdmin){
         return res.status(400).json({
             errors:[{
                 msg:"Must be admin to get coaches"
             }]
         })
     }
     const coaches = await coach.findMany({
         select:{
             coachName:true,
             isAdmin:true,
             active:true
         }
     })
     console.log(`Sent coaches to ${req.loggedCoach}`)
     return res.status(200).json(coaches)
});

router.get('/GetActiveCoaches',checkToken,async (req,res)=>{
    //Check if user is admin
    const isAdmin = req.isAdmin;
    if (!isAdmin){
        return res.status(400).json({
            errors:[{
                msg:"Must be admin to get coaches"
            }]
        })
    }
    const coaches = await coach.findMany({
        where:{
            active:true
        },
        select:{
            coachName:true,
            isAdmin:true,
        }
    })
    console.log(`Sent coaches to ${req.loggedCoach}`)
    return res.status(200).json(coaches)
});

router.post('/ChangeCoachState',checkToken,async (req,res)=>{
    //Check if user is admin
    const isAdmin = req.isAdmin;
    if (!isAdmin){
        return res.status(400).json({
            errors:[{
                msg:"Must be admin to change coache state"
            }]
        })
    }

    const {coachName} = req.body;
    //Check coach doesnt exist
    const coachInstance = await coach.findFirst({
        where:{
            coachName
        }
    })
    if(!coachInstance){
       return res.status(400).json({
        errors:[{
            msg:"Coach doesnt exists"
        }]
       })
    }
    await coach.update({
        where:{
            coachName
        },
        data:{
            active:!coachInstance.active
        }
    });
    console.log(`Changed state of coach ${coachName} to ${!coachInstance.active}`)
    res.status(200).send("Changed state of coach");
})

module.exports = router