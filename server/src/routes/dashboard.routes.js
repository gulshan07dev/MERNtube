import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js"
import {
    getChannelStats,
    getChannelVideos
} from "../controllers/dashboard.controller.js";

const router = Router();
router.use(verifyJwt)

router.route("/stats").get(getChannelStats);
router.route("/videos").get(getChannelVideos);

export default router;