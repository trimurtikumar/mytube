import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler( async (req,res) => {
    //get user details from frontend (hum postman se yaha pe user details le skte hai)
    //validation - not empty
    //check if user already exists: username,email
    //check for images, check for avatar (because they are compulsury)
    //upload them on cloudinary, avatar
    //create user object - create entry in db  (object kyuki jb mongoDB me data bhejunga to wo object leta hai nosql hai)
    //remove password and refresh token field from response
    //check for user creation
    //return response
    //sb hone ke baad unnessesory console log hata do ya comment bana do

    const { fullName, email, username, password } = req.body        //form ya json se data aa raha hai to body se fetch ho jata hai lekin agar url se aa raha hai to alag process hai
    //console.log("email: ",email);

    if(
        [fullName, email, username, password].some((field) => field?.trim() === "")        //subse fhehle field hai ya nhi , agar hai to kya wo empty hai ya nhi , kiski bhi step pe false aaya then false, ye for each field ke liye check hoo gaya
    ){
        throw new ApiError(400,"All fields are required")
    }

    /*if (fullName === ""){
        throw new ApiError(400,"fullName is required")          // aaise if else bana ke saare conditions ek ek krke check krna hota hai , but we have an alternate array option above
    }*/

    const existedUser =await User.findOne({      //fineOne hume sbse phehla occurrence find krke dega
        $or: [{ username }, { email }]      //agar user ya email already existed hai then wo existedUser me save ho jayega
    })

    if(existedUser){
        throw new ApiError(409, "User with email or username already exist")        //Api error hum phehle hi define kr chuke hai ApiError.js me
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;     //request ki gyi files ki multer se , kyuki user se files multer lega , agar file hai then uska avatar, if avatar hai then uska path
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;     //ye sb kaha se aa raha hai "/register" route se aa raha hai

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){        //upper wali line error de rhi thi undefined wali , to usko comment bana ke ye block likha gaya hai. isme ache se check kiya gaya hai ki coverimage hai ya nhi
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400,"Avatar file is required")
    }

    const user = await User.create({
        fullName,
        avatar : avatar.url,     //creation ke liye yaad kro mongoose me avatar ko string liya tha isliye avatar.url
        coverImage: coverImage?.url || "",      //avatar to necessory hai, humne uper check kr liya hai , but cover image user de bhi skta hai aur nhi bhi de skta hai isliye agar nhi diya to empty string nhi to url
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(           //mongoose ya MongoDB me jb kuch bhi naya bnta hai then uski ek _id bnti hai automatically, to hum usko use krke check kr rahe hai ki user bana hai ya nhi, kahi empty submission to nhi kiya
        "-password -refreshToken"       //jo nhi chaiye usko - krdo baki sb select ho jayega
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registerd Successfully")
    )
})


export {registerUser}




/*const registerUser = asyncHandler( async (req,res) => {
    res.status(200).json({
        message: "ok"       //send kr diya json respond
    })
})*/