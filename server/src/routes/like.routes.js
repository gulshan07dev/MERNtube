import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js"
import {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
} from "../controllers/like.controller.js";

const router = Router();
router.use(verifyJwt)

router.route("/video/:videoId").post(toggleVideoLike);

router.route("/comment/:commentId").post(toggleCommentLike);

router.route("/tweet/:tweetId").post(toggleTweetLike);

router.route("/").get(getLikedVideos);

export default router;