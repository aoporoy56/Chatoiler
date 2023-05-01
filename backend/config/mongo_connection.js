const mongoose = require("mongoose");

exports.connectDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_DB);
        console.log("Database Connected");  
    } catch (error) { 
        console.log(error.message); 
    }
}