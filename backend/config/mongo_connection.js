const mongoose = require("mongoose");

exports.connectDB = async () =>{
    try {
        await mongoose.connect(
          "mongodb+srv://root:EAIhKvVS31J1spin@cluster0.aku2ier.mongodb.net/?retryWrites=true&w=majority"
        );
        console.log("Database Connected");  
    } catch (error) { 
        console.log(error.message); 
    }
}