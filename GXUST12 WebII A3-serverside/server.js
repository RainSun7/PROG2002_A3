const express=require("express");
const bodyParser=require("body-parser");
const path=require("path");
const app=express();

var cors = require('cors');
app.use(bodyParser.json()); 
app.use(cors());


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static(__dirname));

app.get("/Admin",(req,res)=>{
  res.sendFile(path.join(__dirname,"Admin.html"));
});

app.get("/Update",(req,res)=>{
  res.sendFile(path.join(__dirname,"Update.html"));
});

app.listen(6060,()=>{
  console.log("Running in 6060");
});