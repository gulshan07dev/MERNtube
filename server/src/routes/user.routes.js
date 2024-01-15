import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeUserPassword,
    changeAccountDetails,
    changeUserAvatar,
    changeUserCoverImage,
    getCurrentUser,
    channel,
    getUserWatchHistory
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
]), registerUser);

router.route("/login").post(loginUser);

router.route("/logout").get(verifyJwt, logoutUser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/change-password").patch(verifyJwt, changeUserPassword);

router.route("/change-account").patch(verifyJwt, changeAccountDetails);

router.route("/change-avatar").patch(
    verifyJwt,
    upload.single("avatar"),
    changeUserAvatar
);

router.route("/change-coverImage").patch(
    verifyJwt,
    upload.single("coverImage"),
    changeUserCoverImage
);

router.route("/current-user").get(verifyJwt, getCurrentUser);

router.route("/c/:username").get(verifyJwt, channel);

router.route("/watch-history").get(verifyJwt, getUserWatchHistory);

export default router;