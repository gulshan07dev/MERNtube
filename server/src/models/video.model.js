import { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const videoSchema = new Schema({
    videoFile: {
        key: {
            type: String
        },
        url: {
            type: String
        }
    },
    thumbnail: {
        key: {
            type: String
        },
        url: {
            type: String
        }
    },
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true
    },
    duration: {
        type: Number,
    },
    views: {
        type: Number,
        default: 0
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    isPublished: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

videoSchema.plugin(mongooseAggregatePaginate)
export const Video = model("Video", videoSchema)