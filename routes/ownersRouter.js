const express=require('express');
const router= express.Router();
const ownerModel=require("../models/owner-model");
const isLoggedin = require('../middlewares/isLoggedin');
const isAdmin= require('../middlewares/isAdmin');
const userModel = require('../models/user-model');
const productModel = require('../models/product-model');

router.get("/admin",isLoggedin,isAdmin,async function(req,res){
   let success= req.flash("success",);
   let products=await productModel.find();
    res.render("createproducts",{products,success})
});

router.post("/create",async function(req,res){
    let owners= await ownerModel.find();
    if(owners.length>0) return res.status(503).send("You don't have persmissions to create a new owner");
    else{
    let {fullname,email,password}=req.query;
    let createdowner =await ownerModel.create({
        fullname,
        email,
        password,
    });
    res.status(201).send("createdowner");
}
});




module.exports=router;