const router = require("express").Router()
const userAuth = require("../middleware/userAuth")
const { registerUser, validateRegUser } = require("../controllers/register")
const { loginUser, validateLoginUser } = require("../controllers/login")
const { updateUser, validateUpdateUser, followUser, unFollowUser } = require("../controllers/update")
const { getUser, getFollowerUser, getFollowingUser } = require("../controllers/getData")

router.post("/register", validateRegUser, registerUser)

router.post("/login", validateLoginUser, loginUser)

router.patch("/update", userAuth, validateUpdateUser, updateUser)

router.patch("/follow/:id", userAuth, followUser)

router.patch("/unfollow/:id", userAuth, unFollowUser)

router.get("/user/:username", getUser)

router.get("/followings", userAuth, getFollowingUser);

router.get("/followers",userAuth, getFollowerUser);

//TODO: LOGOUT a User
router.get("/logout", userAuth, (req, res) => {
    try {
        res.clearCookie("user_jwt")
        res.status(200).json({message:"Successfully logout"})
        console.log('Logout');
    } catch (err) {
        res.status(400).json({error:err})
    }
})

module.exports=router