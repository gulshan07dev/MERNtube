import { Schema, model } from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const likeSchema = new Schema({
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
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

likeSchema.plugin(mongooseAggregatePaginate)
export const Like = model("Like", likeSchema);