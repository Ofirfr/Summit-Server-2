//Anything related to trainings will be here
const router = require("express").Router();

const {PrismaClient} = require('@prisma/client')
const {training} =new PrismaClient();

const checkToken= require("../util/checkToken");
const {userExistsCheck,getTrainingInstance,getDistrictInstance,getTypeInstance} = require("../util/checkExists")


//Get attendance of training
router.get('/GetAttendance',checkToken,async (req,res)=>{
    // just return the list of users in the training
    const {date,district,type} = req.query;
    // Check that all data was filled
    if (date==undefined||district==undefined||type==undefined){
        return res.status(400).json({
            errors:[{
                msg:`Please fill up all data`
            }]
        })
    }
    // Check district exists
    const districtInstance = await getDistrictInstance(district);
    if(!districtInstance){
        return res.status(400).json({
            errors:[{
                msg:`This district doesnt exist`
            }]
        });
    }

    // Check type exists
    const typeInstance = await getTypeInstance(type);
    if(!typeInstance){
        return res.status(400).json({
            errors:[{
                msg:`This type doesnt exist`
            }]
        });
    }

    // Check if there was such training
    const trainingInstance = await getTrainingInstance(date,req.loggedCoachId,districtInstance.id,typeInstance.id);
    if(!trainingInstance){
        return res.status(400).json({
            errors:[{
                msg:`Training doesnt exist`
            }]
        })
    }
    // Get attendance by names from db 
    const attendance = await training.findMany({
        where:{
            id:trainingInstance.id
        },
        select:{
            users:{
                select:
                {
                    userName:true
                }
            }
        }
    })
    console.log(`Sent attendance for training in ${date} in ${district} by coach ${req.loggedCoach}`)
    return res.status(200).json(attendance)
})


// Set list of users as the attendance for the training
router.post('/UpdateAttendance',checkToken,async (req,res)=>{
    // Get list of users to mark and training by coach and date
    const {usersToMark,date,districtName,type} = req.body;
    const coachId = req.loggedCoachId;
    if (date==undefined||districtName==undefined||type==undefined||usersToMark==undefined){
        return res.status(400).json({
            errors:[{
                msg:`Please fill up all data`
            }]
        })
    }

    // Check if district exists
    const districtInstance = await getDistrictInstance(districtName);
    if (!districtInstance){
        return res.status(400).json({
            errors:[{
                msg:"District doesnt exists"
            }]
        })
    }

     // Check type exists
     const typeInstance = await getTypeInstance(type);
     if(!typeInstance){
         return res.status(400).json({
             errors:[{
                 msg:`This type doesnt exist`
             }]
         });
     }


    // Check if training exists, if not - create it.
    var trainingInstance = await getTrainingInstance(date,coachId,districtInstance.id,typeInstance.id);
    if (!trainingInstance){
        trainingInstance=await training.create({
            data:{
                coachId: coachId,
                date: new Date(date),
                districtId:districtInstance.id,
                typeId:typeInstance.id
            }
        })
    }

    // if user in list doesnt exist return error
    for (let i=0;i<usersToMark.length;i++){
        if(!await userExistsCheck(usersToMark[i].userName)){
            return res.status(400).json({
                errors:[{
                    msg:`User ${usersToMark[i].userName} doesnt exist`
                }]
            })
        }
    }
    // Update the training attendance by the users sent
    await training.update({
        where:{
            id:trainingInstance.id
        },
        data:{
            users:{
                disconnect:trainingInstance.users,
                connect:usersToMark
            },
        }
    })
    console.log("Marked users as attendance")
    return res.status(200).send("Marked users as attendance")
})


module.exports = router