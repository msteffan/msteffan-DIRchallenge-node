// load in our dependencies

var express = require("express");
var router = express.Router();
var User = require("../db/connection").models.User;

function error(response, message){
  response.status(500);
  response.json({error: message})
}




module.exports = router;
