import cloudinary from "../Config/cloudinary.js";

export const cloudinaryUploader = (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { 
        resource_type: 'auto',  
        folder: "Blinkit"      
      }, 
      (error, result) => {
        if (error) {
          reject({ error: 'Failed to upload to Cloudinary' });
        } else {
          resolve(result); 
        }
      }
    ).end(file.buffer);
  });
};
