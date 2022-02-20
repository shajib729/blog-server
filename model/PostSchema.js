const mongoose = require('mongoose')
const PostSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    tags: {
      type:Array  
    },
    description: {
        type: String,
    },
    coverImage: {
        type: String,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    like: {
        type:Array
    },
    disLike: {
        type:Array
    },
    comments: [
        {
            user: {
                type: mongoose.Types.ObjectId,
                ref: "User"
            },
            comment: {
                type: String,
            },
            like: {
                type:Array
            },
            disLike: {
                type:Array
            },
            time: {
                type: Date,
            }
        }
    ]
},
{
    timestamps:true
})

const Post = mongoose.model("Post", PostSchema)

module.exports = Post;