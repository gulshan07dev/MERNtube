import { Schema, model } from "mongoose"

const tweetSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

}, { timestamps: true })

export const Tweet = model("Tweet", tweetSchema);