const Post = require("../model/PostSchema")

const createPost = async (req, res) => {
    try {
        const { title, description, tags, coverImage } = req.body

        if (!title) {
            res.status(400).json({error:"Title shoudn't be blank"})
        }else if (!description) {
            res.status(400).json({error:"Description shoudn't be blank"})
        } else {
            const newPost=await Post.create({title, description, tags, coverImage, user:req.userId})
            res.status(200).json({newPost})
        }    
        
    } catch (err) {
        res.status(400).json({error:err.message})
    }
}

const updatePost = async (req, res) => {
    try {
        const { title, description, tags, coverImage } = req.body

        if (!title) {
            res.status(400).json({error:"Title shoudn't be blank"})
        }else if (!description) {
            res.status(400).json({error:"Description shoudn't be blank"})
        } else {
            const updatedPost=await Problem.updateOne({_id:req.params.postId}, {title, description, tags, coverImage})
            res.status(200).json({updatedPost})
        }    
        
    } catch (err) {
        res.status(400).json({error:err.message})
    }
}

// to get all existing posts
const getPosts = async (req, res) => {
    try {
        const post=await Post.find().sort({updatedAt:1}).populate("user", "fullname username email profilePicture")
        res.status(200).json({post})  
        
    } catch (err) {
        res.status(400).json({error:err.message})
    }
}

// to get a single post by id
const getPost = async (req, res) => {
    try {
        const post=await Post.findOne({_id:req.params.id}).populate("user", "fullname username email profilePicture")
        res.status(200).json({post})  
        
    } catch (err) {
        res.status(400).json({error:err.message})
    }
}

// delete a post by it's id
const deletePost = async (req, res) => {
    try {
        const { id } = req.params
        const post = await Post.findById(id)
        if (post.user._id == req.userId) {
            const deleted=await Post.deleteOne({_id:id})
            res.status(200).json({message:"Post is successfully deleted", deleted})
        } else {
            res.status(400).json({error:"Can't delete others post"})
        }
    } catch (err) {
        res.status(400).json({error:err.message})
    }
}

// find all post of a user by his id
const getUserPosts = async (req, res) => {
    try {
        const { id } = req.params
        const getPost = await Post.find({ user: id })
        
        res.status(200).json({ message: getPost })
        
    } catch (err) {
        res.status(400).json({error:err.message})
    }
}

// like a post
const likePost = async (req, res) => {
    const { postId } = req.params
    checkLike = await Post.findById(postId)
    if (!checkLike.like.includes(req.userId)) {
        await Post.updateOne({_id:postId},{$pull:{disLike:req.userId}})
        await Post.updateOne({ _id: postId }, { $push: { like: req.userId } })

        const countLike = await Post.findOne({_id:postId})

        res.status(200).json({message:"Post is liked", totalLike:countLike.like.length-countLike.disLike.length})
    } else {
        await Post.updateOne({ _id: postId }, { $pull: { like: req.userId } })

        const countLike = await Post.findOne({_id:postId})

        res.status(200).json({message:"Cancel Like", totalLike:countLike.like.length-countLike.disLike.length})
    }
}

// dislike a post
const disLikePost = async (req, res) => {
    try {
        const { postId } = req.params
        checkDisLike = await Post.findById(postId)
        if (!checkDisLike.disLike.includes(req.userId)) {
            await Post.updateOne({_id:postId}, {$pull:{like:req.userId}})
            await Post.updateOne({ _id: postId }, { $push: { disLike: req.userId } })

            const countLike = await Post.findOne({_id:postId})

            res.status(200).json({message:"Post is disLiked", totalLike:countLike.like.length-countLike.disLike.length})
        } else {
            await Post.updateOne({ _id: postId }, { $pull: { disLike: req.userId } })

            const countLike = await Post.findOne({_id:postId})

            res.status(200).json({message:"Cancel disLike", totalLike:countLike.like.length-countLike.disLike.length})
        }
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}

// TODO: Comment in a post
const postComment = async (req, res) => {
    try {
        const { postId } = req.params

        await Post.updateOne({ _id: postId }, { $push: { comments: { user: req.userId, comment: req.body.comment, time:Date() } } })
        
        res.status(200).json({message:"Comment is created."})
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}

// Update a Comment in a post
const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params
        
        await Post.updateOne({ 'comments._id': commentId }, {$set:{"comments.$.comment" : req.body.comment}})
        
        res.status(200).json({message:"Updated this comment"})
        
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}

// Delete a Comment in a post
const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params
        
        const deleted=await Post.updateOne({ 'comments._id': commentId }, {$pull:{'comments':{_id:commentId}}})
        
        res.status(200).json({message:"Deleted this comment", deleted})
        
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}

// Like a Comment in a post
const likePostComment = async (req, res) => {
    try {
        const { commentId } = req.params

        const getPost = await Post.findOne({ 'comments._id': commentId })
        const getComment = getPost.comments.filter(comment => comment._id == commentId)[0]
        
        if (!getComment.like.includes(req.userId)) {
            await Post.updateOne({ 'comments._id': commentId }, {$push:{"comments.$.like" : req.userId}})
            await Post.updateOne({ 'comments._id': commentId }, { $pull: { "comments.$.disLike": req.userId } })
            
            res.status(200).json({message:"Like this comment"})
        } else {
            await Post.updateOne({ 'comments._id': commentId }, { $pull: { "comments.$.like": req.userId } })
            
            res.status(200).json({message:"Canel like this comment"})
        }
        
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}

// DisLike a Comment in a post
const disLikePostComment = async (req, res) => {
    try {
        const { commentId } = req.params

        const getPost = await Post.findOne({ 'comments._id': commentId })
        const getComment = getPost.comments.filter(comment => comment._id == commentId)[0]
        
        if (!getComment.disLike.includes(req.userId)) {
            await Post.updateOne({ 'comments._id': commentId }, {$push:{"comments.$.disLike" : req.userId}})
            await Post.updateOne({ 'comments._id': commentId }, { $pull: { "comments.$.like": req.userId } })
            
            res.status(200).json({message:"DisLike this comment"})
        } else {
            await Post.updateOne({ 'comments._id': commentId }, { $pull: { "comments.$.disLike": req.userId } })
            
            res.status(200).json({message:"Canel DisLike this comment"})
        }
        
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}

module.exports = { createPost, updatePost, getPosts, getPost, deletePost, getUserPosts, likePost, disLikePost, postComment, updateComment, deleteComment, likePostComment, disLikePostComment }