const userModel=require('../models/user-model')
const bcrypt=require("bcrypt");
const jwt=require('jsonwebtoken');
const {}= require("../utils/generateToken");
const generateToken = require('../utils/generateToken');
const flash=require("connect-flash");

module.exports.registerUser=async function(req,res){
    try {
        let{email,password,fullname}=req.body;
        let user =await userModel.findOne({email:email});
        if (user) {
            req.flash("error", "You Already have an account, Please login !");
            return res.redirect("/");  // Redirect to the index page
        }
        bcrypt.genSalt(10,function(err,salt){
            bcrypt.hash(password,salt,async function(err,hash){
                if(err)return res.send(err.message);
                else {
                    let user= await userModel.create({
                        email,
                        password:hash,
                        fullname,
                    });
                    let token=  generateToken(user);
                   res.cookie("token",token);
                   req.flash("success", "User Created Successfully!");
                    return res.redirect("/");  // Redirect to the index page
                    
                }
            });
        });
    
    } catch (error) {
        res.send(error.message);
    }
};

module.exports.loginUser=async function(req,res){
    let{email,password}=req.body;

    let user =await userModel.findOne({email:email});
    if (!user) {
        req.flash("error", "Email / Password incorrect");
        return res.redirect("/");  // Redirect to the index page
    }
    
    bcrypt.compare(password,user.password,function(err,result){
        if(result){
          let token=  generateToken(user);
          res.cookie("token",token);
          res.redirect("/shop");
        }
        else{
             req.flash("error","Email or password Incorrect");
             return res.redirect("/");
        }
    })
};

module.exports.logout=function(req,res){
    res.cookie("token"," ");
    res.redirect("/");
};

