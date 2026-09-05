import { Router } from "express";
import { logoutUser, loginUser, registerUser, refreshAccessToken } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"        //to upload files
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(     //yaha pe aayega aur /user/register  pe chala jayega, aur registerUser User.controller.js
    upload.fields([         // fields is an array having multiple type entries
        {
            name: "avatar",     //jo bhi file lunga wo kis naam se hogi? avatar naam se. this builds the communication between the frontend and backend engineeres
            maxCount: 1         //how many files you want to accept currently taking 1 only
        },
        {
            name:"coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)       

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logoutUser)     //logout krne se phelle verify hoga
router.route("/refresh-token").post(refreshAccessToken)     //kyuki maine verify ka kaam wahi controller me kr diya isliye mujhe yaha pe verify jwt yaha pe nhi lagana pada

export default router       //export default isliye quiki mn chaha naam diye hai 'router'
