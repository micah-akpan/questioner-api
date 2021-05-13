import multer from 'multer';
import cloudinary from 'cloudinary';
import cloudinaryStorage from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const storage = cloudinaryStorage({
  cloudinary,
  transformation: [{ width: 300, height: 300, crop: 'limit' }],
  allowedFormats: ['jpg', 'png'],
  folder: 'assets',
});

export default multer({ storage });
