const dotenv = require("dotenv");
dotenv.config();
const cloudinary = require("cloudinary").v2;
const fs = require("fs").promises;
const path = require('path')
const mime = require('mime-types')

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const formattedPath = path.resolve(localFilePath)
        const mimeType = mime.lookup(formattedPath)

        let transformationOptions = {}

        if(mimeType.startsWith('image/')) {
            transformationOptions = {
                resource_type: "image",
                transformation: [
                    {    width: 400, height: 400, crop: "fill", gravity: "auto" }  
                ]
            }
        } else if(mimeType.startsWith('video/')){
            transformationOptions = {
                resource_type: 'video',
                // transformation: [
                //     { width: 1920, height: 1080, crop: 'limit', quality: "auto" }  // Adjust as needed
                // ]
            }
        } else{
            throw new Error('Unsurpported file format')
        }

        const response = await cloudinary.uploader.upload(formattedPath, transformationOptions);

        await fs.unlink(localFilePath);
        return response;
    } catch (error) {
        try {
            await fs.unlink(localFilePath);
        } catch (fsError) {
            console.log("Error deleting file:", fsError);
        }
        console.error("Upload error:", error);
        return null;
    }
};

module.exports = uploadOnCloudinary