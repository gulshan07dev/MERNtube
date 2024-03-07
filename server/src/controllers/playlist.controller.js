import { Playlist } from "../models/playlist.model.js"
import { User } from "../models/user.model.js"
import { Video } from "../models/video.model.js"
import { Types, isValidObjectId } from "mongoose"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"


// create playlist
const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description, isPrivate } = req.body;
    const userId = req.user?._id;

    // check if any field is empty
    if (!name) {
        throw new ApiError(400, "Name field is required!");
    }

    const playlist = await Playlist.create({
        name,
        description,
        isPrivate,
        owner: userId
    })

    if (!playlist) {
        throw new ApiError(500, "Something went wrong while creating playlist!");
    }

    return res.status(200).json(new ApiResponse(
        200,
        { playlist },
        "Playlist created successfully"
    ))
})

// get user playlists by userId
const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10, videoId } = req.query;

    // Check if userId is valid
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid userId!");
    }

    // Check if videoId is valid
    if (videoId && !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId!");
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found!");
    }

    let video;
    // Check if video exists
    if (videoId) {
        video = await Video.findById(videoId);
        if (!video) {
            throw new ApiError(404, "Video not found!");
        }
    }

    const matchPipeline = []

    // Filter playlists based on user ownership
    if (userId.toString() == req.user._id.toString()) {
        matchPipeline.push({
            $match: {
                owner: new Types.ObjectId(userId)
            }
        })
    }

    // Filter playlists based on privacy and ownership
    if (userId.toString() !== req.user._id.toString()) {
        matchPipeline.push({
            $match: {
                $and: [
                    { owner: new Types.ObjectId(userId) },
                    { isPrivate: false },
                ]
            }
        })
    }

    const aggregatePipeline = Playlist.aggregate([
        ...matchPipeline,
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "playlistVideos",
                pipeline: [
                    {
                        $sort: { createdAt: -1 }
                    },
                    {
                        $limit: 1,
                    },
                    {
                        $project: {
                            thumbnail: 1,
                        },
                    },
                ],
            },
        },
        {
            $sort: {createdAt: -1}
        },
        {
            $addFields: {
                playlistThumbnail: {
                    $cond: {
                        if: { $isArray: "$playlistVideos" },
                        then: { $first: "$playlistVideos.thumbnail" },
                        else: null,
                    },
                },
                isVideoAddedToPlaylist: {
                    $cond: {
                        if: { $in: [videoId ? video?._id : null, "$videos"] },
                        then: true,
                        else: false,
                    },
                },
                videosCount: {
                    $size: "$videos"
                }
            },
        },
        {
            $project: {
                name: 1,
                description: 1,
                isPrivate: 1,
                playlistThumbnail: 1,
                isVideoAddedToPlaylist: 1,
                videosCount: 1
            }
        }
    ]);

    // Aggregate and paginate playlists
    Playlist.aggregatePaginate(aggregatePipeline, { page, limit })
        .then(function (result) {
            return res.status(200).json(new ApiResponse(
                200,
                { result },
                "Playlists fetched successfully"
            ));
        })
        .catch(function (error) {
            throw error;
        });
});

// get playlist by id
const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    // check if Invalid playlistId
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlistId!");
    }

    const playlist = await Playlist.aggregate([
        {
            $match: {
                _id: new Types.ObjectId(playlistId),
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "playlistVideos",
                pipeline: [
                    {
                        $sort: { createdAt: -1 }
                    },
                    {
                        $project: {
                            thumbnail: 1,
                            views: 1
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                playlistThumbnail: {
                    $cond: {
                        if: { $isArray: "$playlistVideos" },
                        then: { $first: "$playlistVideos.thumbnail" },
                        else: null,
                    },
                },
                owner: {
                    $first: "$owner"
                },
                videosCount: {
                    $size: "$videos"
                },
                totalViews: {
                    $sum: "$playlistVideos.views"
                }
            },
        },
        {
            $project: {
                name: 1,
                description: 1,
                owner: 1,
                isPrivate: 1,
                playlistThumbnail: 1,
                videosCount: 1,
                totalViews: 1
            }
        }
    ]);

    if (!playlist.length) {
        throw new ApiError(404, "Playlist not found!");
    }

    return res.status(200).json(new ApiResponse(
        200,
        { playlist: playlist[0] },
        "Playlist fetched successfully"
    ));
});

// get user playlist videos
const getUserPlaylistVideos = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    let { page = 1, limit = 10, sortBy, sortType } = req.query;

    // Validate page and limit
    page = parseInt(page);
    limit = parseInt(limit);

    // Check if Invalid playlistId
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlistId");
    }

    // Check if playlist not exist
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found!");
    }

    const pipeline = [];

    pipeline.push({
        $match: {
            _id: new Types.ObjectId(playlistId)
        }
    });

    if (playlist?.owner?.toString() == req.user._id.toString()) {
        pipeline.push({
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "playlistVideo"
            }
        });
    } else {
        pipeline.push({
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "playlistVideo",
                pipeline: [
                    {
                        $match: {
                            isPublished: true
                        }
                    }
                ]
            }
        });
    }

    pipeline.push({
        $unwind: "$playlistVideo"
    });

    pipeline.push({
        $lookup: {
            from: "users",
            localField: "playlistVideo.owner",
            foreignField: "_id",
            as: "playlistVideo.owner",
            pipeline: [
                {
                    $project: {
                        fullName: 1,
                        username: 1,
                        avatar: 1
                    }
                }
            ]
        }
    });

    pipeline.push({
        $addFields: {
            "playlistVideo.owner": { $arrayElemAt: ["$playlistVideo.owner", 0] }
        }
    });

    // Optionally, add sorting stage if sortBy and sortType are provided
    if (sortBy && sortType) {
        const sortStage = {};
        sortStage[sortBy] = sortType === "asc" ? 1 : -1;
        pipeline.push({ $sort: sortStage });
    }
    
    pipeline.push({
        $project: {
            _id: 0,
            playlistVideo: 1
        }
    })
    const aggregate = Playlist.aggregate(pipeline);

    Playlist.aggregatePaginate(aggregate, { page, limit })
        .then(function (result) {
            return res.status(200).json(new ApiResponse(
                200,
                { result },
                "Fetched videos successfully"
            ));
        })
        .catch(function (error) {
            throw error;
        });
});

// add video to playlist
const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    // check if Invalid playlistId or videoId
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlistId or videoId!");
    }

    // check if playlist or video not exist
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found!");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found!");
    }

    // check if video is already in the playlist
    if (playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video is already in the playlist!");
    }

    // add video to playlist
    const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId, {
        $push: { videos: videoId },
    });

    if (!updatedPlaylist) {
        throw new ApiError(500, "Something went wrong while adding video to playlist!");
    }

    return res.status(200).json(new ApiResponse(
        200,
        {},
        "Video added to playlist successfully"
    ));
});

// remove video from playlist
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    // check if Invalid playlistId or videoId
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlistId or videoId!");
    }

    // check if playlist or video not exist
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found!");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found!");
    }

    // remove video from playlist
    const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId, {
        $pull: { videos: videoId },
    });

    if (!updatedPlaylist) {
        throw new ApiError(400, "Something went wrong while remove video to playlist!");
    }

    return res.status(200).json(new ApiResponse(
        200,
        {},
        "Video removed from playlist successfully"
    ));
});

// delete playlist by playlistId
const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    // check if Invalid playlistId
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlistId!");
    }

    // check if playlist not exist
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found!");
    }

    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);

    if (!deletedPlaylist) {
        throw new ApiError(500, "Something went wrong while deleting playlist!");
    }

    return res.status(200).json(new ApiResponse(
        200,
        {},
        "Playlist deleted successfully"
    ))
})

// update playlist by playlistId
const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description, isPrivate } = req.body

    // check if Invalid playlistId
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlistId!");
    }

    // check if any field is empty
    if (!name) {
        throw new ApiError(400, "Name fields is required!");
    }

    // check if playlist not exist
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found!");
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId, {
        $set: {
            name,
            description,
            isPrivate
        }
    }, { new: true })

    if (!updatedPlaylist) {
        throw new ApiError(500, "Something went wrong while updating playlist!");
    }

    return res.status(200).json(new ApiResponse(
        200,
        { playlist: updatedPlaylist },
        "Playlist updated successfully"
    ))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    getUserPlaylistVideos,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}