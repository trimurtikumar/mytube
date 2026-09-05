import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"    //user ki cookies ko acess and set kr paaau


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,     //request sirf is origin se aaye kahi aur se naa aaye
    credentials: true
}))

app.use(express.json({limit:"16kb"}))   // middleware to take imput as json of max 16kb
app.use(express.urlencoded({extended:true,limit:"16kb"}))       //urlencoded url ko encode krta hai jaise space % ho jayega ye sb and extended se object ke ander object jaisa kuch hai to wo bhi le skte hai
app.use(express.static("public"))  //public assets ko store krne ke liye 
app.use(cookieParser())         //req ke pass cookies ka access chala gaya


//routes import

import userRouter from './routes/user.routes.js'

//routes declaration.. ab yaha aap.get use nhi kr skte kyuki humare routes dusre file me save hai yaha nhi hai 
//yaha use krne ke liye app.use krna pdega

//app.use("/users", userRouter)       //yaha pe /user hote hi ye routes me jayega aur waha router function ko khojega ab waha pe jitne bhi router honge unme ye jaaa skte hai

app.use("/api/v1/users", userRouter)        //standard pratice

export {app}