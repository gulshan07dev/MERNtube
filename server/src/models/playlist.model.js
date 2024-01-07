import { Schema, model } from "mongoose"

const playlistSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxLimit: [20, "Playlist name must be less than 20 character!"]
    },
    description: {
        type: String,
        required: true,
        maxLimit: [200, "Playlist name must be less than 200 character!"]
    },
    videos: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    owner:
    {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

}, { timestamps: true })

export const Playlist = model("Playlist", playlistSchema);