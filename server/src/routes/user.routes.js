import { Router } from "express";
import { changeAccountDetails, changeUserAvatar, changeUserPassword, loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
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


export default router;