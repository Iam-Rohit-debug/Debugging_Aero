const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require('path');




const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("Public"));

mongoose.connect("mongodb://localhost:27017/Aerothon",{useNewUrlParser:true});

const newUserScheme = ({
    username:String,
    email:String,
    password:String
});

const userModel = mongoose.model("user",newUserScheme);


app.get("/",function(req,res){
    res.render("home");
})
app.get("/register",function(req,res){
    res.render("register");
});
app.get("/login",function(req,res){
    res.render("login");
});
app.get("/dashboard",function(req,res){
    res.render("dashboard");
});

app.post("/register",function(req,res){


        try {
          userModel.findOne({ email: req.body.email }, (err, result) => {
            if (err) {
              return res.status(500).send({
                responseMessage: "Internal server error",
                responseCode: 501,
                error: err,
              });
            } else if (result) {
              return res.status(500).send({
                responseMessage: "email already exists",
                responseCode: 401,
                error: [],
              });
            } else {
            //   let otp = common.generateOtp();
            //   console.log(otp);
            //   req.body.otp = otp;
      
            //   var time = +new Date();
            //   let currentTime = time + 180000;
            //   req.body.otpTime = currentTime;
      
              
              let password = bcrypt.hashSync(req.body.password);
      
              req.body.password = password;
              userModel(req.body).save((err1, res1) => {
                if (err1) {
                  return res.status(500).send({
                    responseMessage: "Internal server error",
                    responseCode: 501,
                    error: err1,
                  });
                } else {
                    res.redirect('/login')
                //   return res.status(200).send({
                //     responseMessage: "Signup success",
                //     responseCode: 200,
                    
                //   });
                }
              });
            }
          });
        } catch (error) {
          console.log(error);
          return res.status(501).send({
            responseMessage: "Something went wrong",
            responseCode: 501,
            error: error,
          });
        }
          
});

app.post("/login",function(req,res){
   
        try {
          let password = req.body.password;
          console.log(password);
          userModel.findOne({ email: req.body.email }, (err, result) => {
            if (err) {
              return res.status(500).send({
                responseMessage: "Internal server error",
                responseCode: 501,
                error: err,
              });
            } else {
              bcrypt.compare(password, result.password, function (err, f_result) {
                if (err) {
                  return res.status(500).send({
                    responseMessage: "Password Checker is not Working",
                    responseCode: 501,
                    error: err,
                  });
                } else {
                  if (f_result) {
                    console.log("Signin success");
                    res.redirect('/dashboard');
                    // return res.status(200).send({
                    //   responseMessage: "Signin success",
                    //   responseCode: 200,
                    //   result: f_result,
                    // });
                  } else {
                    return res.status(400).send({
                      responseMessage: "password didn't match",
                      responseCode: 401,
                      error: [],
                    });
                  }
                }
              });
            }
          });
        } catch (error) {
          console.log(error);
          return res.status(501).send({
            responseMessage: "Something went wrong",
            responseCode: 501,
            error: error,
          });
        }
      
})

app.listen(3000,function(){
    console.log("server has started at port 3000");
})