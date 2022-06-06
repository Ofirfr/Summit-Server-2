// Anything training type related will be here
const router = require("express").Router();

const {PrismaClient} = require('@prisma/client')
const {trainingType} =new PrismaClient();

const checkToken= require("../util/checkToken");
const {getTypeInstance} = require("../util/checkExists")

// Add training type
router.post('/AddTrainingType',checkToken,async (req,res)=>{
    //Only admin can add training type
    isAdmin = req.isAdmin;
    if (!isAdmin){
        return res.status(400).json({
            errors:[{
                msg:"Must be admin to add training type"
            }]
        })
    }


    // Check all data was filled
    const {type} =req.body;
    if(type==undefined){
        return res.status(400).json({
            errors:[{
                msg:`Please fill up all data`
            }]
        })
    }
    // Check if type already exists
    const typeInstance = await getTypeInstance(type);
    if (typeInstance){
        return res.status(400).json({
            errors:[{
                msg:`Type already exists`
            }]
        })
    }
    await trainingType.create({
        data:{
            type
        }
    })
    console.log("Created training type: " +type);
    res.status(200).send("Created training type: " +type);
});
router.get('/GetTrainingTypes',checkToken,async (req,res)=>{
    const traingTypes = await trainingType.findMany({
        select:{
            type:true
        }
    });
    console.log("Sent training types to "+req.loggedCoach);
    res.status(200).json(traingTypes);
});

module.exports = router