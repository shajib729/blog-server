const User = require("../model/UserSchema")
const jwt = require("jsonwebtoken")

// GET A USER && ( check the user is authenticate user or not )
const getUser = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username })
        const token = await jwt.verify(req.cookies.user_jwt, process.env.SECRET_KEY)
        
        if (user) {
            res.status(200).json({user, isAuth:token._id==user._id})
        } else {
            res.status(400).json({error:"User is not found!"})
        }
        
    } catch (err) {
        res.status(400).json({error:err.message})
    }
}

// GET all that You are Following
const getFollowingUser = async (req, res) => {    
    try {
      const user = await User.findById(req.userId)
      
    // Process 1: To Findout all followings user
        // const friends = await Promise.all(
        //     user.followings.map((friendId) => {
        //         return User.findById(friendId);
        //     })
        // );
        // res.send(friends)
        
    // Process 2: To Findout all followings user
        const friends=[]
        for (let i = 0; i < user.followings.length; i++){
            friends.push(await User.findById(user.followings[i]))    
        }
        // console.log(user.followings);
        // let friendList = [];
        // friends.map((friend) => {
        // const { _id, fullname, username, profilePicture } = friend;
        // friendList.push({ _id, fullname, username, profilePicture });
        // });
        res.status(200).json(friends)

    } catch (err) {
      res.status(500).json(err.message);
      console.log(err.message,"Error to find followings");
    }
}

// GET Your Followers
const getFollowerUser = async (req, res) => {
    
    try {
        const user = await User.findById(req.userId)
        
        const friends=[]
        for (let i = 0; i < user.followers.length; i++){
            friends.push(await User.findById(user.followers[i]))    
        }
        res.status(200).json(friends)

    } catch (err) {
      res.status(500).json(err.message);
      console.log(err.message,"Error to find followers");
    }
}

module.exports={getUser, getFollowingUser, getFollowerUser}