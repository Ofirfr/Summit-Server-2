const {PrismaClient, prisma} = require('@prisma/client')
const {coach} =new PrismaClient();

// Check if coach logged is an admin
const isAdminCheck = async (req)=>{
    const isAdmin = await coach.findFirst({
        where:{
            name:req.loggedCoach,
            isAdmin:true
        }
    })
    return isAdmin!=null;
}
module.exports = {isAdminCheck}