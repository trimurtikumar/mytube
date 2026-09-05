import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


const generateAccessAndRefreshTokens = async(userId) => {       //hum ise baar baar use krenga isliye function bana diya
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})     //jabhi save krenge , because ye mongoose ka feature hai, hume password required hoga , but in this case we are only saving refreshtoken, to hum sirf ise save krnege validate nhi krnege
    
        return {accessToken, refreshToken}      //accessToken and refresh token generate ho gye , refreshToken save hoo gaya , ab inko return krwa do jaha pe ye call hue hai
    
    }catch (error){
        console.error("error :" ,error)
        throw new ApiError(500,"something went wrong while generating refresh and access token")        //because ye error humare side se hai kyuki hum usertoken nhi generate ya send kr paaaye isliye 500
    }
}

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

//Ab likhenge userlogin
const loginUser = asyncHandler(async (req,res) => {
    //req body se data laao
    //username or email
    //find the user
    //password check
    //access and refresh token
    //send cookie

    const { email , username , password } = req.body        //frontend se data liya
    console.log(email);

    if(!username && !email){        //user ya to email ya to username diya hoga, agar dono nhi diya then ApiError
        throw new ApiError(400,"username or email is required")
    }

    const user = await User.findOne({       //checking if the username or email exists in database , and because the database is in different continent it requires time to fetch thats why await
        $or: [{username},{email}]
    })

    if(!user){      //if user not exist
        throw new ApiError(404,"user does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)      //here we are calling function from the userSchema to check password , it willreturn true or false

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid user credentials")
    }

    const {accessToken ,refreshToken} = await generateAccessAndRefreshTokens(user._id)      //accessToken and refreshToken ban gaya ab isko cookies me bhejo

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")        //its an optional step , as we are saving loggedin user into a new variable with not password and refreshToken fields

    const options = {       //jo cookies bani usko koi be modify kr ska hai jo hum nhi chahte isliye isko secure kr diye taki sirf server pe modify hoo
        httpOnly : true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)        //key then value then security
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken       //ApiResponse me ye wala hissa data hai //hum response me access and refresh token bhej rahe hai because may be uers ise save krna chahe
            },
            "User logged in successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req,res)=> {      //dekho jb loging kr rahe the tb humare pass .body se inputs aaye the jisse hum DB me user ko khoje paye, but yaha pe aaisa nhi kr skte kyuki humare pass user ko find kerne ke liye kuch bhi nhi hai
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1     //hum _id se find kiye user ko and then usko undefined kr diye mtlb delete kr diye 
            }
        },
        {
            new: true
        }
    )

    const options = {       //jo cookies bani usko koi be modify kr ska hai jo hum nhi chahte isliye isko secure kr diye taki sirf server pe modify hoo
        httpOnly : true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async(req,res) => {     //frontend wale ko ek endpoint chaiye hoga jaha wo access token ko refresh kr sake by the help of refresh token
    const incommingRefreshToken = req.cookies.refreshToken || req.body.refreshToken         //request cookies me bhi aa skta hai ya to body me bhi aa skta hai

    if(!incommingRefreshToken){
        throw new ApiError(401,"unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incommingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401,"Invalid refresh token")
        }
    
        if(incommingRefershToken !== user?.refreshToken){
            throw new ApiError(401,"Refresh token is expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken,options)
        .cookie("refreshToken", newRefreshToken,options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})



export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}




/*const registerUser = asyncHandler( async (req,res) => {
    res.status(200).json({
        message: "ok"       //send kr diya json respond
    })
})*/