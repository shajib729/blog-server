const Problem = require("../model/ProblemSchema")

const createProblem = async (req, res) => {
    try {
        const { title, description, tags, coverImage } = req.body

        if (!title) {
            res.status(400).json({error:"Title shoudn't be blank"})
        }else if (!description) {
            res.status(400).json({error:"Description shoudn't be blank"})
        } else {
            const newProblem=await Problem.create({title, description, tags, coverImage, user:req.userId})
            res.status(200).json({newProblem})
        }    
        
    } catch (err) {
        res.status(400).json({error:err.message})
    }
}

const updateProblem = async (req, res) => {
    try {
        const { title, description, tags, coverImage } = req.body

        if (!title) {
            res.status(400).json({error:"Title shoudn't be blank"})
        }else if (!description) {
            res.status(400).json({error:"Description shoudn't be blank"})
        } else {
            const updatedProblem=await Problem.updateOne({_id:req.params.problemId}, {title, description, tags, coverImage})
            res.status(200).json({updatedProblem})
        }    
        
    } catch (err) {
        res.status(400).json({error:err.message})
    }
}

// to get all existing problems
const getProblems = async (req, res) => {
    try {
        const problem=await Problem.find().populate("user", "fullname username email profilePicture")
        res.status(200).json({problem})  
        
    } catch (err) {
        res.status(400).json({error:err.message})
    }
}

// to get a single problem by id
const getProblem = async (req, res) => {
    try {
        const problem=await Problem.findOne({_id:req.params.id}).populate("user", "fullname username email profilePicture")
        res.status(200).json({problem})  
        
    } catch (err) {
        res.status(400).json({error:err.message})
    }
}

// delete a problem by it's id
const deleteProblem = async (req, res) => {
    try {
        const { id } = req.params
        const problem = await Problem.findById(id)
        if (problem.user._id == req.userId) {
            const deleted=await Problem.deleteOne({_id:id})
            res.status(200).json({message:"Problem is successfully deleted", deleted})
        } else {
            res.status(400).json({error:"Can't delete others problem"})
        }
    } catch (err) {
        res.status(400).json({error:err.message})
    }
}

// find all problem of a user by his id
const getUserProblems = async (req, res) => {
    try {
        const { id } = req.params
        const getProblem = await Problem.find({ user: id })
        
        res.status(200).json({ message: getProblem })
        
    } catch (err) {
        res.status(400).json({error:err.message})
    }
}

// like a problem
const likeProblem = async (req, res) => {
    const { problemId } = req.params
    checkLike = await Problem.findById(problemId)
    if (!checkLike.like.includes(req.userId)) {
        await Problem.updateOne({_id:problemId},{$pull:{disLike:req.userId}})
        await Problem.updateOne({ _id: problemId }, { $push: { like: req.userId } })

        const countLike = await Problem.findOne({_id:problemId})

        res.status(200).json({message:"Problem is liked", totalLike:countLike.like.length-countLike.disLike.length})
    } else {
        await Problem.updateOne({ _id: problemId }, { $pull: { like: req.userId } })

        const countLike = await Problem.findOne({_id:problemId})

        res.status(200).json({message:"Cancel Like", totalLike:countLike.like.length-countLike.disLike.length})
    }
}

// dislike a problem
const disLikeProblem = async (req, res) => {
    try {
        const { problemId } = req.params
        checkDisLike = await Problem.findById(problemId)
        if (!checkDisLike.disLike.includes(req.userId)) {
            await Problem.updateOne({_id:problemId}, {$pull:{like:req.userId}})
            await Problem.updateOne({ _id: problemId }, { $push: { disLike: req.userId } })

            const countLike = await Problem.findOne({_id:problemId})

            res.status(200).json({message:"Problem is disLiked", totalLike:countLike.like.length-countLike.disLike.length})
        } else {
            await Problem.updateOne({ _id: problemId }, { $pull: { disLike: req.userId } })

            const countLike = await Problem.findOne({_id:problemId})

            res.status(200).json({message:"Cancel disLike", totalLike:countLike.like.length-countLike.disLike.length})
        }
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}

// TODO: Comment in a problem
const problemComment = async (req, res) => {
    try {
        const { problemId } = req.params

        await Problem.updateOne({ _id: problemId }, { $push: { comments: { user: req.userId, comment: req.body.comment, } } })
        
        res.status(200).json({message:"Comment is created."})
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}

// Update a Comment in a problem
const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params
        
        await Problem.updateOne({ 'comments._id': commentId }, {$set:{"comments.$.comment" : req.body.comment}})
        
        res.status(200).json({message:"Updated this comment"})
        
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}

// Delete a Comment in a problem
const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params
        
        const deleted=await Problem.updateOne({ 'comments._id': commentId }, {$pull:{'comments':{_id:commentId}}})
        
        res.status(200).json({message:"Deleted this comment", deleted})
        
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}

// Like a Comment in a problem
const likeProblemComment = async (req, res) => {
    try {
        const { commentId } = req.params

        const getProblem = await Problem.findOne({ 'comments._id': commentId })
        const getComment = getProblem.comments.filter(comment => comment._id == commentId)[0]
        
        if (!getComment.like.includes(req.userId)) {
            await Problem.updateOne({ 'comments._id': commentId }, {$push:{"comments.$.like" : req.userId}})
            await Problem.updateOne({ 'comments._id': commentId }, { $pull: { "comments.$.disLike": req.userId } })
            
            res.status(200).json({message:"Like this comment"})
        } else {
            await Problem.updateOne({ 'comments._id': commentId }, { $pull: { "comments.$.like": req.userId } })
            
            res.status(200).json({message:"Canel like this comment"})
        }
        
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}

// DisLike a Comment in a problem
const disLikeProblemComment = async (req, res) => {
    try {
        const { commentId } = req.params

        const getProblem = await Problem.findOne({ 'comments._id': commentId })
        const getComment = getProblem.comments.filter(comment => comment._id == commentId)[0]
        
        if (!getComment.disLike.includes(req.userId)) {
            await Problem.updateOne({ 'comments._id': commentId }, {$push:{"comments.$.disLike" : req.userId}})
            await Problem.updateOne({ 'comments._id': commentId }, { $pull: { "comments.$.like": req.userId } })
            
            res.status(200).json({message:"DisLike this comment"})
        } else {
            await Problem.updateOne({ 'comments._id': commentId }, { $pull: { "comments.$.disLike": req.userId } })
            
            res.status(200).json({message:"Canel DisLike this comment"})
        }
        
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}

// Accept a Comment in a problem
const acceptProblemComment = async (req, res) => {
    try {
        const { commentId } = req.params

        const getProblem = await Problem.findOne({ 'comments._id': commentId })
        const getComment = getProblem.comments.filter(comment => comment._id == commentId)[0].isAccepted

        await Problem.updateOne({ 'comments._id': commentId }, { $set: { "comments.$.isAccepted": !getComment } })

        res.status(200).json({message:"Accepted the answer."})
        
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}

module.exports = { createProblem, updateProblem, getProblems, getProblem, deleteProblem, getUserProblems, likeProblem, disLikeProblem, problemComment, updateComment, deleteComment, likeProblemComment, disLikeProblemComment, acceptProblemComment }