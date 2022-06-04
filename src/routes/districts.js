// Anything district related will be here


const router = require("express").Router();

const {PrismaClient} = require('@prisma/client')
const {district,user} =new PrismaClient();

const checkToken= require("../util/checkToken");
const {getDistrictInstance} = require("../util/checkExists")


// Add district
router.post('/AddDistrict',checkToken,async (req,res)=>{
    const isAdmin = req.isAdmin;
    // Only admin can add district
    if (!isAdmin){
        return res.status(400).json({
            errors:[{
                msg:"Must be admin to add district"
            }]
        })
    }

    const {districtName} =req.body;
    // Check all data was filled
    if (districtName==undefined){
        return res.status(400).json({
            errors:[{
                msg:"Please fiil up all data"
            }]
        })
    }

    // Check district already exist
    const districtExist = await getDistrictInstance(districtName);
    if (districtExist){
        return res.status(400).json({
            errors:[{
                msg:"District already exists"
            }]
        })
    }

    await district.create({
        data:{
            name:districtName
        }
    })
    console.log("Created district " +districtName)
    res.status(200).send("District added succesfully")
});

router.get('/GetDistricts',checkToken,async (req,res)=>{
    const districts = await district.findMany({
        select:{
            name:true
        }
    });
    console.log("Sent district list to "+req.loggedCoach);
    res.status(200).json(districts);
});

router.get('/GetUsersByDistrict',checkToken,async (req,res)=>{
    const {districtName} = req.body;
    // Check all data was filled
    if (districtName==undefined){
        return res.status(400).json({
            errors:[{
                msg:"Please fiil up all data"
            }]
        })
    }
    // Get district Id
    const districtInstance = await (district.findFirst({
        select:{
            id:true
        },
        where:{
            name:districtName
        }
    }))
    if(districtInstance == null){
        return res.status(400).json({
            errors:[{
                msg:"District doesnt exist"
            }]
        })
    }
    const districtId = districtInstance.id;    
    // Get users list
    const users = await user.findMany({
        select:{
            userName:true
        },
        where:{
            districtId,
            active:true
        }
    })
    console.log(`Sent users of district ${districtName} to ${req.loggedCoach}`)
    res.status(200).json(users);
});
router.get("/GetUsersByOtherDistricts",checkToken,async (req,res)=>{
    const {districtName} = req.body;
    // Check all data was filled
    if (districtName==undefined){
        return res.status(400).json({
            errors:[{
                msg:"Please fiil up all data"
            }]
        })
    }
    // Get district Id
    const districtInstance = await (district.findFirst({
        select:{
            id:true
        },
        where:{
            name:districtName
        }
    }))
    if(districtInstance == null){
        return res.status(400).json({
            errors:[{
                msg:"District doesnt exist"
            }]
        })
    }
    const districtId = districtInstance.id;    
    // Get users list
    const users = await user.findMany({
        select:{
            userName:true
        },
        where:{
            NOT:{
                districtId,
            },
            active:true
        }
    })
    console.log(`Sent users of district ${districtName} to ${req.loggedCoach}`)
    res.status(200).json(users);
})



module.exports = router