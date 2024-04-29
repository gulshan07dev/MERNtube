import { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const feedbackSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        query: {
            type: String,
            required: [true, "Query is required"],
            trim: true
        },
        isQueryResolved: {
            type: Boolean,
            default: false
        },
        queryResolver: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        queryResolverReply: {
            type: String,
            trim: true
        }
    },
    { timestamps: true }
);

feedbackSchema.plugin(mongooseAggregatePaginate);

export const Feedback = model("Feedback", feedbackSchema);
