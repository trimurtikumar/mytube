import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new Schema(
    {
        videoFile: {
            type: String,    //cloudinary url
            required: true
        },
        thumbnail: {
            type: String,
            required: true
        },
        thumbnail: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        duration: {
            type: String,
            required : true
        },
        views: {
            type: Number,
            default: 0      //default dena jaruri hai nhi to automaticall views aa jaenge
        },
        isPublished: {
            type: Boolean,
            default: true
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {timestamps: true}
)

videoSchema.plugin(mongooseAggregatePaginate)       //hum is khud ka plugin bana skte hai. basically kya hai kuch kaam hai jo kisi kaam ke phehle ya baad me krte hai


export const Video = mongoose.model("Video",videoSchema)