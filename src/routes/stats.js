//Anything related to trainings will be here
const router = require("express").Router();

const {PrismaClient} = require('@prisma/client');
const {training} =new PrismaClient();

const checkToken= require("../util/checkToken");
const {userExistsCheck,getTrainingInstance,getDistrictInstance,getTypeInstance} = require("../util/checkExists")


router.get("/StatsByParams",checkToken, async (req,res) =>{

    // Only admin can get stats
    const adminCheck = req.isAdmin;
    if (!adminCheck){
        return res.status(400).json({
            errors:[{
                msg:"Must be admin to see stats"
            }]
        });
    }

    const {districtName,typeName,coachName,startDate,endDate} = req.query;
    // Set up conditions for the search
    var conditions = {};
    if (districtName!=undefined&&districtName!="Any"){
         var condition = {};
         condition["name"]=districtName;
         conditions["district"] = condition;
    }
    if (typeName!=undefined&&typeName!="Any"){
        var condition = {};
         condition["type"]=typeName;
         conditions["type"] = condition;
    }
    if (coachName!=undefined&&coachName!="Any"){
        var condition = {};
        condition["coachName"]=coachName;
        conditions["coach"] = condition;
    }
    if(startDate!=undefined&&endDate!=undefined){
        var condition = {};
        var startDateFormat = startDate.split('/');
        var endDateFormat = endDate.trim().split('/');
        condition["lte"]=new Date(new Date(endDateFormat[2],endDateFormat[1]-1,endDateFormat[0]).getTime()+ 86400000);
        condition["gte"]=new Date(startDateFormat[2],startDateFormat[1]-1,startDateFormat[0]);
        conditions["date"] = condition;
    }
   // Fetch result
   const result = await training.findMany({
       where:conditions,

       select:{
           date:true,
           type:{
               select:{
                   type:true
               }
           },
           district:{
               select:{
                   name:true
               }
           },
           coach:{
               select:{
                   coachName:true
               }
           },
           users:{
               select:{
                   userName:true
               }
           }
       }
   });
   console.log(`Sent stats to ${req.loggedCoach}`);
   res.status(200).json(result);
});

router.get("/StatsByUser",checkToken,async (req,res)=>{
     // Only admin can get stats
     const adminCheck = req.isAdmin;
     if (!adminCheck){
         return res.status(400).json({
             errors:[{
                 msg:"Must be admin to see stats"
             }]
         });
     }
     
});


module.exports = router