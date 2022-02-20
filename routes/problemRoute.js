const router = require("express").Router()
const userAuth = require("../middleware/userAuth")
const { createProblem, getProblems, getProblem, deleteProblem, getUserProblems, likeProblem, disLikeProblem, problemComment, likeProblemComment, disLikeProblemComment, updateComment, deleteComment, acceptProblemComment, updateProblem } = require("../controllers/Problem")

router.post("/problem/create_problem", userAuth, createProblem)

router.post("/problem/update_problem/:problemId", userAuth, updateProblem)

router.get("/problem/get_problem/:id", getProblem)

router.get("/problem/get_problems", getProblems)

router.get("/problem/get_users_problem/:id", getUserProblems)

router.delete("/problem/delete_problem/:id", userAuth, deleteProblem)

router.patch("/problem/like/:problemId", userAuth, likeProblem)

router.patch("/problem/disLike/:problemId", userAuth, disLikeProblem)

router.post("/problem/comment/:problemId", userAuth, problemComment)

router.patch("/problem/update_comment/:commentId", userAuth, updateComment)

router.delete("/problem/delete_comment/:commentId", userAuth, deleteComment)

router.patch("/problem/like_comment/:commentId", userAuth, likeProblemComment)

router.patch("/problem/disLike_comment/:commentId", userAuth, disLikeProblemComment)

router.patch("/problem/accept_comment/:commentId", userAuth, acceptProblemComment)

module.exports=router