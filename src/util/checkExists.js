const {PrismaClient} = require('@prisma/client')
const {user,training,district,trainingType} =new PrismaClient();

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
    const trainingInstance = await training.findFirst({
        where:{
            coachId,
            date:new Date(date),
            districtId,
            typeId
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