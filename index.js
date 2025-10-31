const express = require('express');
const app = express();
const cron = require('node-cron')
const { exec } = require("child_process");
const dotenv = require('dotenv')
let jsonData = []

dotenv.config();

//settings
app.set('appName', 'Validador Zelle Mayor28');
app.set('view engine','ejs');

//middleware
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

app.post('/data' , (req , res)=>{

   jsonData.push(req.body)
   res.end()

})

app.get('/getdata', (req,res) =>{

    res.status(200).json(jsonData)
})

cron.schedule("* * * * *", () =>{
    exec("node gmailApi.js", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
})

app.listen(process.env.PORT, () => {
    console.log(`Escuchando en puerto ${process.env.PORT}`)
})