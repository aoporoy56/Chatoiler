const jwt = require("jsonwebtoken");
exports.Jwt_token = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn : "30d"
    })
}