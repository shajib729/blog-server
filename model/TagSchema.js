const mongoose = require('mongoose')
const TagSchema = new mongoose.Schema({
    tags: {
        type: Array,
        default:['javascript', 'web-design']
    },
},
{
    timestamps:true
})

const Tag = mongoose.model("Tag", TagSchema)

module.exports = Tag;