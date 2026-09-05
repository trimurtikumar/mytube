import mongoose, {Schema} from "mongoose";      //jwt ek bearer token hai , mtlb jo isko bear krega mai usko sahi maan lunga aur usko access dunga , iska info .env me hai
import jwt from "jsonwebtoken"      //ye user me kyu hai because password to yahi pe define kiya gaya hai
import bcrypt from "bcrypt"         //because encryption direct nhi kr skte thats why we need pre (hoocks)

const userSchema = new Schema({
    username: {
        type:String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true     //index ko use krne se ye DB ke searching me aa jata hai jisse searching aasan ho jati hai
    },                  //aur sbko index nhi krna hai nhi to band bj jayegi
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName:{
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar:{
        type: String,       //cloudinary url
        required: true,
    },
    coverImage:{
        type: String
    },
    watchHistory: [
        {
            type:Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password:{
        type: String,       //ab password DB me direct nhi likhte usko string me encrypt rakhte hai. aur comparision problem bcrypt library se thik hota hai . and json web token kya krta hai decrypt the password with a secret, because decrypt algorithm public avalilable hai isliye secret
        required: [true,'Password is required']
    },
    refreshToken: {
        type: String
    }
},
{
    timestamps: true
})

userSchema.pre("save", async function (next){       //jbhi data save hoo raha ho use phehle kaam karana hai. hum yaha pe direct call back nhi krte problem aati hai isliye function, ab because encryption me time lgta hai isliye async
    if(!this.isModified("password")) return next;     //to ab agar pawword wala field modified nhi hua hai then yaha pe bcrypt krne ki jarurat nhi hai
    
    this.password =await bcrypt.hash(this.password, 10)       //number of hash rounds 10    //ab because ye middileware hai isliye isme next dena hoga aur last me next batana hoga taki values next work me jaaye
    next          //ab kya hoo raha hai ki jabhi koi field change hogi tb tb password change hooo jayega jo hum nhi chahte , aur ye problem thik hoo gaya if statement lgane se
})

//to check password we are constructing a method from userSchema(power of mongoose)
userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password)        //bcrypt data ko compare krke true false me bhi bata skta hai
}

userSchema.methods.generateAccessToken = function(){
        return jwt.sign(
        {
            _id: this._id,      //ye mondoDB automatically generate kr deta hai, baki sb database se aayega
            email: this.email,
            username: this.username,
            fullName : this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){       //refresh token bhi same hi trike se generate hota hai isliye sidha copy paste, but isme info km hoti hai
    return jwt.sign(
        {
            _id: this._id,      //ye mondoDB automatically generate kr deta hai, baki sb database se aayega
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)