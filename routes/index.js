const express=require("express");
const isLoggedin = require("../middlewares/isLoggedin");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");
const router =express.Router();

router.get("/",function(req,res){
    let error=req.flash("error");
    let success=req.flash("success");
    res.render("index",{error,success});
});

router.get("/shop",isLoggedin,async function(req,res){
    let products= await productModel.find();
    let added=req.flash("added");
    res.render("shop",{products,added});
});

router.get("/cart",isLoggedin,async function(req,res){
    let user= await userModel.findOne({email:req.user.email}).populate("cart");
    const bill = user.cart.reduce((total, item) => {
        return total + (Number(item.price) - Number(item.discount));
    }, 0);
    res.render("cart",{user,bill});
});

router.get("/addtocart/:id",isLoggedin,async function(req,res){
   let user= await userModel.findOne({email:req.user.email});
   user.cart.push(req.params.id); 
    await user.save();
    req.flash("added","Added to Cart");
    res.redirect("/cart");

});


router.get("/search", async function (req, res) {
    try {
        let keyword = req.query.keyword || ""; // Get keyword from query


        let filter = {};
        if (keyword.trim() !== "") {
            filter = { keyword: { $regex: keyword, $options: "i" } }; // Search in 'keyword' field
        }

        let material = await productModel.find(filter);
      

        res.render("products", { material }); // Send filtered results
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});


router.delete("/delete/:id", isLoggedin, async (req, res) => {
    try {
        let deleted = await productModel.findOneAndDelete({ _id: req.params.id });
        res.redirect("/owner/admin")
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
});


router.delete("/cart/:productId", isLoggedin, async (req, res) => {
    try {
        const userId = req.user._id; // ✅ Corrected: MongoDB uses _id
        const productId = req.params.productId;

        console.log("Removing product:", productId, "from user:", userId);

        const user = await userModel.findByIdAndUpdate(
            userId,
            { $pull: { cart: productId } }, // Directly remove ObjectId
            { new: true }
        );
        

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.json({ success: true, cart: user.cart });
    } catch (error) {
        console.error("Error removing from cart:", error);
        res.status(500).json({ success: false, message: "Error removing from cart" });
    }
});




module.exports=router;