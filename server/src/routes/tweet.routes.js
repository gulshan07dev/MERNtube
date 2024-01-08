import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js"
import {
    createTweet,
    updateTweet,
    getUserTweets,
    deleteTweet,
} from "../controllers/tweet.controller.js";

const router = Router();

router.route("/")
    .post(verifyJwt, createTweet)

router.route("/:tweetId")
    .patch(verifyJwt, updateTweet)
    .delete(verifyJwt, deleteTweet)

router.route("/:userId")
    .get(getUserTweets)

export default router;