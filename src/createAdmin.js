const bcrypt = require('bcrypt');
const {PrismaClient} = require('@prisma/client')
const {coach} =new PrismaClient();
const dotenv = require('dotenv');

dotenv.config();

const createAdmin = async ()=>{
    adminPassword = process.env.adminPassword;
    hashedPassword = await bcrypt.hash(adminPassword,10);

    adminName = process.env.adminName;

    const coachExists = await coach.findFirst({
        where:{
            name:adminName
        }
    })
    if(coachExists){
        // No need to create admin if it exists
       return 
    }
    await coach.create({
        data:{
            name:adminName,
            password:hashedPassword,
            isAdmin:true
        }
    })
}

module.exports=createAdmin