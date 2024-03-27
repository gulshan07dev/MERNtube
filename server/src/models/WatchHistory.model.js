import { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const watchHistorySchema = new Schema({
    videoId: {
        type: Schema.Types.ObjectId,
        ref: "Video",
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

watchHistorySchema.plugin(mongooseAggregatePaginate)
export const WatchHistory = model("watchHistory", watchHistorySchema);
