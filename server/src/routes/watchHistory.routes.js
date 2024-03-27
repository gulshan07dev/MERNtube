import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js"
import {
    addVideoToWatchHistory,
    clearWatchHistory,
    getWatchHistoryVideos,
    removeVideoFromWatchHistory,
    toggleWatchHistoryPauseStatus
} from "../controllers/watchHistory.controller.js";

const router = Router();
router.use(verifyJwt)

router.route("/add/:videoId").post(addVideoToWatchHistory)
router.route("/remove/:historyId").delete(removeVideoFromWatchHistory)
router.route("/toggle_status").patch(toggleWatchHistoryPauseStatus)
router.route("/")
    .get(getWatchHistoryVideos)
    .delete(clearWatchHistory)

export default router;