import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";

const connectDB = async()=>{
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);  //database .env me hai aur uska naam .constants me hai dono hi humb=ne yaha de diya aur usko naam de diya connection instance
        console.log(`\n MONGODB connected !! DB HOST:${connectionInstance.connection.host}`);       // taki console pe hume pata rahe ki kya kisse connect hoo raha hai
    }catch(error){
        console.log("MONGODB connection error",error);
        process.exit(1);
    }
};

export default connectDB;        // yaha database bn gaya ab isko main index.js me import krlo