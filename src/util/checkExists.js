const {PrismaClient} = require('@prisma/client')
const {user,training} =new PrismaClient();

// Check if user with the name given exists
const userExistsCheck =async (userName)=>{
    userExists =await user.findFirst({
        where:{
            userName
        }
    });
    return userExists!=null;
}
const getTrainingInstance = async (date,coachId)=>{
    trainingInstance = await training.findFirst({
        where:{
            coachId,
            date:new Date(date)
        }
    });
    return trainingInstance;

}
module.exports = {userExistsCheck,getTrainingInstance}