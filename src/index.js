//require('dotenv').config({path:'./env'})    //for batter consistency ab isko config bhi krna hoga
import dotenv from "dotenv";
import connectDB from "./db/index.js"; //to import database from db index.js
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config({
    path:'./.env'
})

connectDB();     //database import hoo gaya but usko import krne ke liya .env ko bhi import krna hoga







/*
import mongoose from "mongoose";
import DB_NAME from "./constants";
import express from "express";
const app = expresss()

(async () => {      // a way to creat a function with asyncawait
    try {
        await mongoose.connect(`${process.env.
        MONGODB_URI}/${DB_NAME}`)   //conect kr diya mongodb uri ko jaha mera database connected hai and uska naame constants me se le liya 
        app.on("error",(error)=>{       // if the database is not connected to express then this will give error
            console.log("Error: ",error);
            throw error
        })

        app.listen(process.env.PORT , ()=>{
            console.log(`App is listening on port $
                {process.env.PORT}`);
        })
    }catch(error){
        console.error("Error: ",error)
        throw err
    }
})()
*/     
