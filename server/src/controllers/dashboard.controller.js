import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Types } from "mongoose"
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"

// get channel stats
const getChannelStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Get total video views count
    const totalVideoViews = await Video.aggregate([
        {
            $match: {
                owner: new Types.ObjectId(userId)
            }
        },
        {
            $group: {
                _id: null,
                totalVideoViews: { $sum: "$views" }
            }
        }
    ]);

    // Get total subscribers
    const totalSubscribers = await Subscription.aggregate([
        {
            $match: {
                channel: new Types.ObjectId(userId)
            }
        },
        {
            $count: "totalSubscribersCount"
        }
    ]);

    // Get total videos count
    const totalVideos = await Video.aggregate([
        {
            $match: {
                owner: new Types.ObjectId(userId)
            }
        },
        {
            $count: "totalVideosCount"
        }
    ]);

    // Get total likes count for videos and tweets
    const totalVideoLikes = await Video.aggregate([
        {
            $match: {
                owner: new Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "videoLikes"
            }
        },
        {
            $group: {
                _id: null,
                totalLikes: { $sum: { $size: "$videoLikes" } }
            }
        }
    ]);

    const stats = {
        totalVideoViews: totalVideoViews[0]?.totalVideoViews || 0,
        totalSubscribers: totalSubscribers[0]?.totalSubscribersCount || 0,
        totalVideos: totalVideos[0]?.totalVideosCount || 0,
        totalVideoLikes: totalVideoLikes.length > 0 ? totalVideoLikes[0].totalLikes : 0
    }

    return res.status(200).json(new ApiResponse(
        200,
        { stats },
        "Channel stats fetched successfully"
    ))
});

// get channel videos
const getChannelVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const videos = await Video.find({ owner: userId });

    return res.status(200).json(new ApiResponse(
        200,
        { videos },
        "Channel videos fetched successfully"
    ))
})

export {
    getChannelStats,
    getChannelVideos
}