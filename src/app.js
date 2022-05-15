const express = require('express');
const dotenv = require('dotenv');
const res = require('express/lib/response');

dotenv.config();

const main = async ()=>{
    const port = process.env.PORT;
    app = express();
    app.use(express.json());
    app.use('/coach', require("./routes/coaches.js"))

    app.get('/',(req,res)=>{
       res.send("Hello there");
    });
    app.listen(port,()=>{
        console.log(`Server listening on  http://127.0.0.1:${port}`);
    });
};
main().then();