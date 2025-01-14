const Alert=require("../models/alertModel");
require("dotenv").config()

//Create Alert Function
exports.createAlert=async(req, res)=> {

    try{
    const body = req.body;
    const alert = {

        username: body.username,
        currency: body.currency,
        upperRange:body.upperRange,
        lowerRange:body.lowerRange,
    }

    if(!alert.currency){
        return res.status(400).json("Please enter currency");
    }
    if(!alert.username){
        return res.status(400).json("Please enter username");
    }
    /*const user=await Alert.findOne({"username":alert.username});
    if(!user){
        return res.status(400).json("Invalid Credentials");
    };*/

    const result = await Alert.create(alert);
    console.log("Alert created", alert);
    return res.status(200).json({msg:"Alert created successfully"});
}catch (dbError) {

        console.log(dbError);
        return res.status(500).json("Database error");
    }
};


            
    
    
