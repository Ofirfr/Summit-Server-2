const {PrismaClient, prisma} = require('@prisma/client')
const {user} =new PrismaClient();

// Check if user with the name given exists
const userExistsCheck =async (userName)=>{
    userExists =await user.findFirst({
        where:{
            name : userName
        }
    });
    return userExists!=null;
}
module.exports = {userExistsCheck}