const jwt = require("jsonwebtoken");
exports.Jwt_token = (id) =>{
    return jwt.sign({id},"aopo",{
        expiresIn : "30d"
    })
}