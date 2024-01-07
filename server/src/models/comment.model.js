import { Schema, model } from "mongoose"

const commentSchema = new Schema({
    content: {
        type: String,
        required: true
     },
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    tweet: {
        type: Schema.Types.ObjectId,
        ref: "Tweet"
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

}, { timestamps: true })

export const Comment = model("Comment", commentSchema);