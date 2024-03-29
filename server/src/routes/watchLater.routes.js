import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
    addVideoToWatchLater,
    getUserWatchLater,
    removeVideoFromWatchLater
} from "../controllers/watchLater.controller.js";

const router = Router();
router.use(verifyJwt)

router.route("/:videoId")
    .post(addVideoToWatchLater)
    .delete(removeVideoFromWatchLater)
router.route("/").get(getUserWatchLater)

export default router;