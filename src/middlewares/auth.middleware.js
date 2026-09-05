import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"

export const verifyJWT = asyncHandler(async(req,_,next) => {        //because isme res ka koi use nhi hai to hum isko _ likh skte hai
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")        //may be cookie access token se naa aa raha ho, user ek header bhej raha hoo,, syntax me bearer with a space aata hai to usko replace kr diya empty string se.
    
        if(!token){
            throw new ApiError(401,"Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)     //verify wahi kr payega jiske pass secret hoga isliye humne secret provide kiya jwt ko
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user){
            throw new ApiError(401,"Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid access token")
    }

})