const bcrypt = require("bcrypt")
const User = require("../model/UserSchema")
const { body, validationResult } = require("express-validator")
const jwt = require("jsonwebtoken")

// Register user validation
const validateRegUser = [
    body('fullname').not().trim().isEmpty().withMessage("Fullname is required."),
    body('username').not().trim().isEmpty().withMessage("Username is required.").isLength({ min: 3, max: 20 }).withMessage("Username should be 3 to 20 words"),
    body('email').not().trim().isEmpty().withMessage("Email is required.").isEmail().withMessage("Please Enter a valid Email"),
    body('password').not().trim().isEmpty().withMessage("Password is required.").isLength({ min: 6 }).withMessage("Password should contain minimum 6 character"),
    body('cpassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Confirm Password doesn't match")
        } else {
            return true
        }
    })
]

// Register a new user
const registerUser = async (req, res) => {
    let { fullname, username, email, password } = req.body
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({error:errors.formatWith(err=>err.msg).mapped()})
        } else {
            const existEmail = await User.find({ email: email })
            const existUsername = await User.find({ username: username })
            if (existEmail[0]) {
                res.status(400).json({error:"Email already exist"})
            }else if (existUsername[0]) {
                res.status(400).json({error:"Username should be unique"})
            } else {
                const hasedPassword =await bcrypt.hash(password, 10)
                const createdUser = await User.create({ fullname, username, email, password: hasedPassword })
                
                const token = jwt.sign({ _id: createdUser._id }, process.env.SECRET_KEY, {expiresIn:"7d"})
                if (token) {
                    res.cookie("user_jwt", token, {expire : new Date() + 604800000}).status(200).json({message:"User Registered Successfully", createdUser})
                }
            }
        }
    } catch (err) {
        console.log(err);
    }
}

module.exports={registerUser, validateRegUser}