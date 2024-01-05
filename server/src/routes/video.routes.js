import { Router } from "express"
import { verifyJwt } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
import { uploadVideo } from "../controllers/video.controller.js";

const router = Router();

router.route("/video")
    .post(verifyJwt, upload.fields([
        { name: "videoFile", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 },
    ]), uploadVideo)

export default router