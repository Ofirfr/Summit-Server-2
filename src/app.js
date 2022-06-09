const express = require('express');
const dotenv = require('dotenv');
const createAdmin = require('./util/createAdmin');
const https = require('https');
const fs = require('fs');
dotenv.config();

const main = async ()=>{
    const port = process.env.PORT;
    await createAdmin();
    app = express();
    app.use(express.json());

    app.use('/coach', require("./routes/coaches.js"));
    app.use('/user',require('./routes/users.js'));
    app.use('/training',require("./routes/trainings.js"));
    app.use('/district',require('./routes/districts'));
    app.use('/type',require('./routes/trainingTypes'));
    app.use('/stats',require('./routes/stats'));
    
    app.use('/',(req,res)=>{
       res.send("Hello Hello");
    });

    /*const sslServer = https.createServer({
        key:fs.readFileSync('../cert/key.pem'),
        cert:fs.readFileSync('../cert/cert.pem')
    },app)
    sslServer.listen(port,()=>{
        console.log(`Server listening on  https://127.0.0.1:${port}`);
    });*/
    app.listen(port,()=>{
        console.log(`Server listening on  http://127.0.0.1:${port}`)
    })
};
main().then();