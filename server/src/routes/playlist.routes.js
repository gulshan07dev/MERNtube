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

router.route("/")
    .post(verifyJwt, createPlaylist)

router.route("/user/:userId")
    .get(getUserPlaylists)

router.route("/:playlistId")
    .get(getPlaylistById)
    .delete(verifyJwt, deletePlaylist)
    .patch(verifyJwt, updatePlaylist)

router.route("/:playlistId/:videoId")
    .post(verifyJwt, addVideoToPlaylist)
    .delete(verifyJwt, removeVideoFromPlaylist)

export default router;