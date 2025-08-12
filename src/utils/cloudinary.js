import { v2 as cloudinary } from "cloudinary"

import fs from "fs"

console.log(process.env.cloudinary_cloud_name, process.env.cloudinary_api_key, process.env.cloudinary_api_secret);

 cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });




const uploadOnCloudinary = async (localFilePath) => {
    // console.log("cloud", localFilePath);
    try {
        if (!localFilePath) return null;
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        //file has been uploaded successfully
        console.log("file is uploaded on cloudinary", response.url);
        fs.unlinkSync(localFilePath)
        // console.log(response, "cloud resp");
        return response
    }
    catch (error) {
        fs.unlinkSync(localFilePath)//remove the locally saved temporary file as the opertaion failed
        return null;
    }
}

export { uploadOnCloudinary, }