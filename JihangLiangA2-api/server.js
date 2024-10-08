var express = require('express');
var app = express();
var concertAPI = require("./controllerAPI/api-controller");
var cors = require('cors');
app.use(cors());
app.use("/", concertAPI);
app.listen(3060);
console.log("Server up and running on port 3060");