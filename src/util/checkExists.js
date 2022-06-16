const {PrismaClient} = require('@prisma/client');
const {user,training,district,trainingType,coach} =new PrismaClient();

// Check if user with the name given exists
const userExistsCheck =async (userName)=>{
    const userExists =await user.findFirst({
        where:{
            userName
        }
    });
    return userExists!=null;
}
const getTrainingInstance = async (date,coachId,districtId,typeId)=>{
    var dateFormat = date.split('/');
    var trainingDate = new Date(dateFormat[2],dateFormat[1],dateFormat[0]);
    trainingDate.setDate(trainingDate.getDate()+1);
    trainingDate.setMonth(trainingDate.getMonth()-1);
    console.log(trainingDate);
    const trainingInstance = await training.findFirst({
        where:{
            coachId,
            date:trainingDate,
            districtId,
            typeId
        }
        ,select:{
            id:true,
            coachId:true,
            date:true,
            districtId:true,
            typeId:true,
            users:{
                select:{
                    id:true
                }
            }
        }
    });
    return trainingInstance;

}
const getDistrictInstance = async (name)=>{
    const districtInstance = await district.findFirst({
        where:{ 
            name
        }
    })
    return districtInstance;
};
const getTypeInstance = async (type)=>{
    const typeInstance = await trainingType.findFirst({
        where:{
            type
        }
    });
    return typeInstance;
}
module.exports = {userExistsCheck,getTrainingInstance,getDistrictInstance,getTypeInstance}