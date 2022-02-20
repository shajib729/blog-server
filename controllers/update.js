const bcrypt = require("bcrypt")
const User = require("../model/UserSchema")
const { body, validationResult } = require("express-validator")
const jwt = require("jsonwebtoken")

// Update user validation
const validateUpdateUser = [
    body('fullname').not().trim().isEmpty().withMessage("Fullname is required."),
    body('username').not().trim().isEmpty().withMessage("Username is required.").isLength({ min: 3, max: 20 }).withMessage("Username should be 3 to 20 words"),
    body('email').not().trim().isEmpty().withMessage("Email is required.").isEmail().withMessage("Please Enter a valid Email"),
]

// Update a user
const updateUser = async (req, res) => {
    let { fullname, username, email, password, bio, working_as, leaning_now, skills, location, facebook, github, website } = req.body
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({error:errors.formatWith(err=>err.msg).mapped()})
        } else {
            const existEmail = await User.findOne({ email: email })
            const existUsername = await User.findOne({ username: username })
            if (existEmail && existEmail._id != req.userId) {
                res.status(400).json({error:"Email already exist"})
            }else if (existUsername && existUsername._id != req.userId) {
                res.status(400).json({error:"Username should be unique"})
            } else {
                const checkPassword = await bcrypt.compare(password, req.rootUser.password)
                
                if (checkPassword) {
                    const updateUser = await User.updateOne({_id:req.userId}, { fullname, username, email, bio, working_as, leaning_now, skills, location, facebook, github, website })
                
                    res.status(200).json({message:updateUser})
                } else {
                    res.status(400).json({error:"Password is not correct"})
                }
            }
        }
    } catch (err) {
        console.log(err);
    }
}

// Follow a user
const followUser = async (req, res) => {
    try {
        const { id } = req.params
        if (id !== req.userId) {
            const findUser = await User.findOne({ _id: id })
            const currentUser = await User.findOne({ _id: req.userId })
            if (!findUser.followers.includes(req.userId)) {
                await currentUser.updateOne({ $push: { followings: id } })
                await findUser.updateOne({ $push: { followers : req.userId }})

                res.status(200).json({message:"Follow user"})
            } else {
                res.status(400).json({message:"This user already is follwoed"})
            }
        } else {
            res.status(400).json({error:"Can't follow own accout"})    
        }
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}

// Unfollow a user
const unFollowUser = async (req, res) => {
    try {
        const { id } = req.params
        if (id !== req.userId) {
            const findUser = await User.findOne({ _id: id })
            const currentUser = await User.findOne({ _id: req.userId })
            if (findUser.followers.includes(req.userId)) {
                await currentUser.updateOne({ $pull: { followings: id } })
                await findUser.updateOne({ $pull: { followers : req.userId }})

                res.status(200).json({message:"Unfollow user"})
            } else {
                res.status(400).json({message:"This user is not follwoed"})
            }
        } else {
            res.status(400).json({error:"Can't unfollow own accout"})    
        }
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}

module.exports={updateUser, validateUpdateUser, followUser, unFollowUser}