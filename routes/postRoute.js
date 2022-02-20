const router = require("express").Router()
const userAuth = require("../middleware/userAuth")
const { createPost, getPost, getPosts, deletePost, getUserPosts, likePost, disLikePost, postComment, updateComment, likePostComment, disLikePostComment, deleteComment, updatePost } = require("../controllers/Post")

router.post("/post/create_post", userAuth, createPost)

router.post("/post/update_post/:postId", userAuth, updatePost)

router.get("/post/get_post/:id", getPost)

router.get("/post/get_posts", getPosts)

router.get("/post/get_users_post/:id", getUserPosts)

router.delete("/post/delete_post/:id", userAuth, deletePost)

router.patch("/post/like_post/:postId", userAuth, likePost)

router.patch("/post/disLike_post/:postId", userAuth, disLikePost)

router.post("/post/comment/:postId", userAuth, postComment)

router.patch("/post/update_comment/:commentId", userAuth, updateComment)

router.delete("/post/delete_comment/:commentId", userAuth, deleteComment)

router.patch("/post/like_comment/:commentId", userAuth, likePostComment)

router.patch("/post/disLike_comment/:commentId", userAuth, disLikePostComment)

module.exports=router