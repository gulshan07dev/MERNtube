import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js"
import {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    deletePlaylist,
    removeVideoFromPlaylist,
    updatePlaylist
} from "../controllers/playlist.controller.js";

const router = Router();
router.use(verifyJwt)

router.route("/")
    .post(createPlaylist)

router.route("/user/:userId")
    .get(getUserPlaylists)

router.route("/:playlistId")
    .get(getPlaylistById)
    .delete(deletePlaylist)
    .patch(updatePlaylist)

router.route("/:playlistId/:videoId")
    .post(addVideoToPlaylist)
    .delete(removeVideoFromPlaylist)

export default router;