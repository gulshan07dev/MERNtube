import { Schema, model } from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

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
    },
    isPrivate: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })

playlistSchema.plugin(mongooseAggregatePaginate)

export const Playlist = model("Playlist", playlistSchema);