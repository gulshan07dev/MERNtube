import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { Feedback } from "../models/feedback.model.js";

const sendFeedback = asyncHandler(async (req, res) => {
    const { query } = req.body;

    if (!query) {
        throw new ApiError(400, "All fields are required!")
    }

    const feedback = await Feedback.create({
        owner: req.user._id,
        query
    })

    if (!feedback) {
        throw new ApiError(500, "Failed to send feedback!, try again")
    }

    return res.status(200).json(new ApiResponse(
        200,
        {},
        "Your query sent to author successfully."
    ))
})

export {
    sendFeedback
}