const { UserModel } = require("../models/UserModel");
const { Jwt_token } = require("../config/JWT");

exports.register = async (req,res) =>{
    console.log(req.body)
    const {name, email, password, pic} = req.body;
    if(!name || !email || !password){
        res.status(400);
        throw new Error("Please Enter All element");
    }

    const userExists = await UserModel.findOne({email});
    if(userExists){
        res.status(400);
        throw new Error("User Already Exists");
    }
    const user = await UserModel.create({
        name,
        email,
        password,
        pic
    }) 
    if(user){
        res.status(200).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            password : user.password,
            pic : user.pic,
            token : Jwt_token(user._id)
        })
    }
}
exports.login = async (req,res) =>{
    const {email, password} = req.body;
    const user = await UserModel.findOne({email})
    console.log(req.body)
    if(!email || !password){
        res.status(400);
        throw new Error("Please Enter All Data");
    }
    console.log(await user.matchPassword(password));
    if(user && await user.matchPassword(password)){
        res.json({
            _id : user._id,
            name : user.name,
            email : user.email,
            pic : user.pic,
            token : Jwt_token(user._id)
        })
    }else{
        res.status(400);
        throw new Error("Invalid Email or Password");
    }
}
exports.allUser = async (req,res) =>{
    const keyword = req.query.search ? {
        $or : [
            {name : { $regex : req.query.search, $options : 'i'}},
            {email : { $regex : req.query.search, $options : 'i'}}
        ]
    }
    : 
    {};
    const users = await UserModel.find(keyword).find({ _id : {$ne : req.user._id}});
    res.send(users);
}