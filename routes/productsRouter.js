const express=require('express');
const router= express.Router();
const upload= require("../config/multer-config");
const productModel=require("../models/product-model");
const flash = require('connect-flash/lib/flash');



router.post("/create",upload.single("image"),async function(req,res){
try {let {name,
price,
discount,
bgcolor,
panelcolor,
about,
keyword,
textcolor}=req.body;
   let product= await productModel.create({
    image:req.file.buffer,
    name,
    price,
    discount,
    about,
    panelcolor,
    textcolor,
    keyword,
   })
   req.flash("success","Product created successfully");
   res.redirect("/owner/admin");}
   catch(err){
    res.send(err.message);
   }
});

module.exports=router;