const express=require("express");
const bodyParser=require("body-parser");
const path=require("path");
const app=express();

var cors = require('cors');

app.use(cors());


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static(__dirname));

app.get("/Home",(req,res)=>{
  res.sendFile(path.join(__dirname,"Home.html"));
});

app.get("/Search",(req,res)=>{
  res.sendFile(path.join(__dirname,"Search.html"));
});

app.get("/Fundraisers",(req,res)=>{
  res.sendFile(path.join(__dirname,"Fundraisers.html"));
});

app.get("/Donation",(req,res)=>{
  res.sendFile(path.join(__dirname,"Donation.html"));
});

app.listen(8080,()=>{
  console.log("Running in 8080");
});