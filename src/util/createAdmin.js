const bcrypt = require('bcrypt');
const {PrismaClient} = require('@prisma/client')
const {coach} =new PrismaClient();
const dotenv = require('dotenv');

dotenv.config();
/*
Create admin user with name and password given in .env
*/
const createAdmin = async ()=>{
    // Hash password
    adminPassword = process.env.adminPassword;
    hashedPassword = await bcrypt.hash(adminPassword,10);

    adminName = process.env.adminName;
    // Check if this admin is already added
    const coachExists = await coach.findFirst({
        where:{
            name:adminName
        }
    })
    if(coachExists){
        // No need to create admin if it exists
        console.log("This admin exists already, not creating")
       return 
    }
    // Create this admin user
    console.log("Created admin: "+ adminName)
    await coach.create({
        data:{
            name:adminName,
            password:hashedPassword,
            isAdmin:true
        }
    })
}

module.exports=createAdmin