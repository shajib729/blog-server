const mongoose = require('mongoose')
const ProblemSchema = new mongoose.Schema({
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
            isAccepted: {
                type: Boolean,
                default: false,
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

const Problem = mongoose.model("Problem", ProblemSchema)

module.exports = Problem;