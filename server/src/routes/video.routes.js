import { Router } from "express"
import { verifyJwt } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
import {
    publishAVideo,
    updateVideo,
    getVideoById,
    deleteVideo,
    togglePublishStatus,
} from "../controllers/video.controller.js";

const router = Router();

router.route("/")
    .post(verifyJwt, upload.fields([
        { name: "videoFile", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 },
    ]), publishAVideo)

router.route("/:videoId")
    .patch(verifyJwt, upload.single("thumbnail"), updateVideo)
    .get(getVideoById)
    .delete(verifyJwt, deleteVideo)

router.route("/toggle-status/:videoId").post(verifyJwt, togglePublishStatus)


export default router;