const jwt = require("jsonwebtoken")
const User = require("../model/UserSchema")

const userAuth = async (req, res, next) => {
    try {
        // console.log(req.cookies.user_jwt);
        const token = jwt.verify(req.cookies.user_jwt, process.env.SECRET_KEY)
        if (!token) {
            res.status(401).json({error:"Denied to access! Please Login Again."}).redirect('/')
        } else {
            const rootUser = await User.findOne({ _id: token._id })
            req.rootUser = rootUser
            req.userId=token._id
            req.token = req.cookies.jwt

            next()
        }
    } catch (err) {
        res.status(401).json({error:err.message}).redirect('/')
    }
}

module.exports=userAuth