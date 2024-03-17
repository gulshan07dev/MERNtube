import { Schema, model } from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

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

playlistVideoSchema.index({ playlistId: 1, videoId: 1 }, { unique: true });
playlistVideoSchema.plugin(mongooseAggregatePaginate)

export const PlaylistVideo = model("PlaylistVideo", playlistVideoSchema);