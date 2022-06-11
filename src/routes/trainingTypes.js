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
router.get('/GetActiveTrainingTypes',checkToken,async (req,res)=>{
    const traingTypes = await trainingType.findMany({
        where:{
            active:true,
        },
        select:{
            type:true,
        }
    });
    console.log("Sent active training types to "+req.loggedCoach);
    res.status(200).json(traingTypes);
});

router.get('/GetAllTrainingTypes',checkToken,async (req,res)=>{
    const traingTypes = await trainingType.findMany({       
        select:{
            type:true,
            active:true
        }
    });
    console.log("Sent training types to "+req.loggedCoach);
    res.status(200).json(traingTypes);
});


router.post("/ChangeTypeState",checkToken,async (req,res)=>{
    //Only admin can change training type state
    isAdmin = req.isAdmin;
    if (!isAdmin){
        return res.status(400).json({
            errors:[{
                msg:"Must be admin to change training type state"
            }]
        })
    }
    const {typeName} = req.body;
    // Check if type exists
    const typeInstance = await getTypeInstance(typeName);
    if (!typeInstance){
        return res.status(400).json({
            errors:[{
                msg:`Type doesnt exists`
            }]
        })
    }
    await trainingType.update({
        where:{
            id:typeInstance.id
        },
        data:{
            active:!typeInstance.active
        }
    });
    console.log(`Changed state of type ${typeName} to ${!typeInstance.active}`)
    res.status(200).send("Changed state of type");
})

module.exports = router