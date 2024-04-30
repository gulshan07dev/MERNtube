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
        maxLimit: [250, "Playlist name must be less than 250 character!"]
    },
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

const playlistVideoSchema = new Schema({
    playlistId: {
        type: Schema.Types.ObjectId,
        ref: "Playlist",
        required: true
    },
    videoId: {
        type: Schema.Types.ObjectId,
        ref: "Video",
        required: true
    },
    addedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, { timestamps: true })

playlistSchema.plugin(mongooseAggregatePaginate)

playlistVideoSchema.index({ playlistId: 1, videoId: 1 }, { unique: true });
playlistVideoSchema.plugin(mongooseAggregatePaginate)

export const Playlist = model("Playlist", playlistSchema);
export const PlaylistVideo = model("PlaylistVideo", playlistVideoSchema);