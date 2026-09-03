import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
const router = Router()

router.route("/register").post(registerUser)        //yaha pe aayega aur /user/register  pe chala jayega, aur registerUser User.controller.js

export default router       //export default isliye quiki mn chaha naam diye hai 'router'
