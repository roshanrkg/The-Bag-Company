const mongoose=require("mongoose");
const config=require("config");

mongoose.connect("mongodb://127.0.0.1:27017/scatch")
.then(function(){
    console.log("Connected");
})
.catch(function(err){
    console.log(err);
})

module.exports=mongoose.connection;