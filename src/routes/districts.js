// Anything district related will be here


const router = require("express").Router();

const {PrismaClient} = require('@prisma/client')
const {district} =new PrismaClient();

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

module.exports = router