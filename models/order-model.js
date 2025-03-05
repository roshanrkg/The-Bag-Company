const mongoose= require('mongoose');



const orderSchema =mongoose.Schema({
address:String,
phone:Number,
userorder :{
    type:Array,
    default:[]
},

});

module.exports= mongoose.model("order", orderSchema);