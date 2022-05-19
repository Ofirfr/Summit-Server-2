//Anything related to trainings will be here
const router = require("express").Router();

const {PrismaClient} = require('@prisma/client')
const {training} =new PrismaClient();

const checkToken= require("../util/checkToken");
const {userExistsCheck,getTrainingInstance} = require("../util/checkExists")


//Get attendance of training
router.get('/GetAttendance',checkToken,async (req,res)=>{
    // just return the list of users in the training
    const {date,coachId} = req.body;
    const trainingInstance = await getTrainingInstance(date,coachId);
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
    console.log(`Sent attendance for training in ${date} by coach id ${trainingInstance.coachId}`)
    return res.status(200).json(attendance)
})
// Set list of users as the attendance for the training
router.post('/UpdateAttendance',checkToken,async (req,res)=>{
    // get list of users to mark and training by coach and date
    const {usersToAdd,date} = req.body;
    const coachId = req.loggedCoachId;

    // check if training exists, if not - create it.
    trainingInstance = await getTrainingInstance(date,coachId);
    if (!trainingInstance){
        trainingInstance=await training.create({
            data:{
                coachId: coachId,
                date: new Date(date)
            }
        })
    }

    // if user in list doesnt exist return error
    for (let i=0;i<usersToAdd.length;i++){
        if(!userExistsCheck(usersToAdd[i].userName)){
            return res.status(400).json({
                errors:[{
                    msg:`User ${usersToAdd[i].userName} doesnt exist`
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
                connect:usersToAdd
            }
        }
    })
    console.log("Marked users as attendance")
    return res.status(200).send("Marked users as attendance")
})


module.exports = router