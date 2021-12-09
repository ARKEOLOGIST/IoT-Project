const express = require('express');
const bodyParser = require('body-parser');

const port = process.env.PORT || 5000;

const app = express();

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

var BPM_var=0,SpO2_var=0;

app.use('/request',(req,res,next) => {
    res.status(201).json({ BPM: BPM_var, SpO2: SpO2_var });
});

app.post('/data',(req,res,next) => {
    console.log(req.body);
    BPM_var = req.body.BPM;
    SpO2_var = req.body.SpO2;
    res.status(201).send("Hello World!");
});

app.listen(port);