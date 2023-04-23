
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/UserModel");
exports.middle = async (req, res, next) =>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            token = req.headers.authorization.split(" ")[1];

            const decode = jwt.verify(token, process.env.JWT_SECRET);
            const user = await UserModel.findById(decode.id).select("-password");
            req.user = {
                _id : user._id.toHexString(),
                name : user.name,
                email : user.email,
                pic : user.pic
            }
            next();
        } catch (error) {
            console.log(error.message)
            res.status(401);
            throw new Error("No Token")
        }
    }else{
        console.log("No Token");
        res.status(400).send("No Token")
    }
}