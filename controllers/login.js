const bcrypt = require("bcrypt")
const User = require("../model/UserSchema")
const { body, validationResult } = require("express-validator")
const jwt = require("jsonwebtoken")

// Register user validation
const validateLoginUser = [
    body('email').not().trim().isEmpty().withMessage("Email is required.").isEmail().withMessage("Please Enter a valid Email"),
    body('password').not().trim().isEmpty().withMessage("Password is required.").isLength({ min: 6 }).withMessage("Password should contain minimum 6 character"),
]

// Register a new user
const loginUser = async (req, res) => {
    let { email, password } = req.body
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({error:errors.formatWith(err=>err.msg).mapped()})
        } else {
            const existEmail = await User.find({ email: email })
            if (!existEmail[0]) {
                res.status(400).json({error:"Email doesn't exist"})
            } else {
                const loginUser = await User.findOne({ email: email })
                
                if (loginUser) {
                    const checkPassword = await bcrypt.compare(password, loginUser.password)
                    if (checkPassword) {
                        const token = jwt.sign({ _id: loginUser._id }, process.env.SECRET_KEY, {expiresIn:"7d"})
                        if (token) {
                            res.cookie("user_jwt", token, {expire : new Date() + 604800000}).status(200).json({message:"User Successfully Login", loginUser})
                        }
                    } else {
                        res.status(400).json({errror:"Password is wrong"})
                    }
                } else {
                    res.status(400).json({errror:"Login user not found"})
                }
            }
        }
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}

module.exports={loginUser, validateLoginUser}