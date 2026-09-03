import {v2 as cloudinary} from "cloudinary"     //vs ka naam hum kuch bhi de skte hai 
import fs from "fs"     // no need to install fs because its already in node

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
        //upload the file on cloudinary
       const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type : "auto"      //kis type ki file upload hogi , let the cloudinary decide which type of file is coming thats wwhy auto
        })
        //file has been uploaded sussfully
        console.log("file is uploaded on cloudinary ", response.url);       //console me upload hone ke baad public url mil jayega
        return response;     //console to humare liye hai user ke liye return response hai
    }catch(error){
        fs.unlinkSync(localFilePath)        //remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}


export {uploadOnCloudinary}

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});