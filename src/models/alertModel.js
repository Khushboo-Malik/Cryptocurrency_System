const mongoose=require("mongoose");

//Schema for alerts
const AlertSchema=new mongoose.Schema({
    
    username: {
        type:String,
        required:true,
        unique:true,
    },
    currency: {
        type:String,
        enum:["bitcoin","cardano","ethereum"],
        required:true,
    },
    upperRange: {
        type:Number,
        default:10000000,
        unique:false,
    },
    lowerRange: {
        type:Number,
        default:0,
        unique:false,
    }
    });

    const alert=mongoose.model('Alerts',AlertSchema);
    module.exports=alert;