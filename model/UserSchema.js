const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        require: true,
    },
    username: {
        type: String,
        require: true,
        unique: true,
        min: 3,
        max:20
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    birthday: {
        type:Date
    },
    profilePicture: {
        type: String,
        default:"../images/noAvatar.png"
    },
    bio: {
        type:String,
        default:""
    },
    working_as: {
        type:String,
        default:""
    },
    learning_now: {
        type:String,
        default:""
    },
    skills: {
        type:String,
        default:""
    },
    location: {
        type:String,
        default:""
    },
    facebook: {
        type:String,
        default:""
    },
    github: {
        type:String,
        default:""
    },
    website: {
        type:String,
        default:""
    },
    followers: {
        type: Array,
        default:[]
    },
    followings: {
        type: Array,
        default:[],
    },
    following_tags: {
        type: Array,
        default:[]
    },
    messages: {
        type: Array,
        default:[]
    },
    isAdmin: {
        type: Boolean,
        default: false,
    }
},
{
    timestamps:true
})

const User = mongoose.model("User", UserSchema)

module.exports = User;