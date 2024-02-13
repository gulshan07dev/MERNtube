import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js"
import {
    addCommentToVideo,
    addCommentToTweet,
    deleteComment,
    updateComment,
    getVideoComment,
    getTweetComment
} from "../controllers/comment.controller.js";

const router = Router();
router.use(verifyJwt);

router.route("/video/:videoId")
    .post(addCommentToVideo)
    .get(getVideoComment)

router.route("/tweet/:tweetId")
    .post(addCommentToTweet)
    .get(getTweetComment)

router.route("/:commentId")
    .patch(updateComment)
    .delete(deleteComment)

export default router;