import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js"
import {
    addCommentToVideoOrTweet,
    deleteComment,
    updateComment,
    getVideoOrTweetComment
} from "../controllers/comment.controller.js";

const router = Router();

router.route("/")
    .post(verifyJwt, addCommentToVideoOrTweet)

router.route("/:commentId")
    .patch(verifyJwt, updateComment)
    .delete(verifyJwt, deleteComment)

router.route("/:videoOrTweetId")
    .get(getVideoOrTweetComment)

export default router;