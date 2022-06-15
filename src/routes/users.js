//Anything related to users will be here
const router = require("express").Router();

const {PrismaClient} = require('@prisma/client')
const {user} =new PrismaClient();

const dotenv = require('dotenv');

const checkToken= require("../util/checkToken");
const {userExistsCheck,getDistrictInstance} = require("../util/checkExists");

const validatorEmail = require("email-validator");
const validatePhoneNumber = require('validate-phone-number-node-js');

dotenv.config();
//Add user
//Only admin can add users
router.post('/AddUser',checkToken,async (req,res)=>{
    // Check if user is admin
    /*isAdmin = req.isAdmin;
    if (!isAdmin){
        return res.status(400).json({
            errors:[{
                msg:"Must be admin to add user"
            }]
        })
    }*/
    
    const {userName,mainDistrict,email,phoneNumber} = req.body;
  
    // Check all data was filled
    if(userName==undefined||mainDistrict==undefined||email==undefined||phoneNumber==undefined){
        return res.status(400).json({
            errors:[{
                msg: "Please fill up all data"
            }]
        })
    }

    // Check email is valid
    if(!validatorEmail.validate(email)){
        return res.status(400).json({
            errors:[{
                msg: "Email is not valid"
            }]
        })
    }

    //Check that phone number is valid
    if(!validatePhoneNumber.validate(phoneNumber)){
        return res.status(400).json({
            errors:[{
                msg: "Phone Number is not valid"
            }]
        })
    }

    // Check if user exists already 
    const userExists = await userExistsCheck(userName);
    if (userExists){
        return res.status(400).json({
            errors:[{
                msg: "User with this name already exists"
            }]
        })
    }

    // Check if district exists
    const districtInstance = await getDistrictInstance(mainDistrict);
    if (!districtInstance){
        return res.status(400).json({
            errors:[{
                msg: "This district doesnt exist"
            }]
        })
    }

    // Add user as active
    await user.create({
        data: {
            userName,
            active : true,
            districtId:districtInstance.id,
            phoneNumber,
            email
        }
    })
    console.log(`User ${userName} added.`);
    res.status(200).send(`User ${userName} added.`)
})



//Set user inactive/active
//Only admin can change state
router.post("/ChangeState",checkToken,async (req,res)=>{
    //Check if user is admin
    isAdmin = req.isAdmin;
    if (!isAdmin){
        return res.status(400).json({
            errors:[{
                msg:"Must be admin to change state of user"
            }]
        })
    }

    //Check if user exists
    userName = req.body;
    userName = userName.userName;// Take the string value of the json name value
    userExists = await userExistsCheck(userName);
    if (!userExists){
        return res.status(400).json({
            errors:[{
                msg: "User doesnt exist"
            }]
        })
    }
    // Find current state
    const changedUser = await user.findFirst({
        where:{
            userName
        },
        select:{
            id:true,
            active: true
        }
    })

    //Change state of user
    await user.update({
        where:{
            id: changedUser.id
        },
        data:{
            active:!changedUser.active
        }
    });
    console.log(`Changed state of user`);
    res.status(200).send(`Changed active state of user ${userName} to ${!changedUser.active}`)
})


// Get all users
router.get('/GetAllUsers',checkToken,async (req,res)=>{
    isAdmin = req.isAdmin;
    if (!isAdmin){
        return res.status(400).json({
            errors:[{
                msg:"Must be admin to get all users"
            }]
        })
    }
    const allUsers = await user.findMany({
        select:{
            userName:true,
            active:true,
            id:true,
            mainDistrict:{
                select:
                {
                    name:true
                }
            }
        }
    });
    console.log("Sent all users list to "+req.loggedCoach);
    res.status(200).json(allUsers);
})





module.exports = router