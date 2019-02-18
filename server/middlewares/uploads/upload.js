import multer from 'multer';
import path from 'path';
import { stripPathName } from '../../utils';

const storage = multer.diskStorage({
  destination: './server/assets',
  filename: (req, file, cb) => {
    const newFileName = `${stripPathName(file.originalname)}-${Date.now()}${path.extname(file.originalname)}`;

    cb(null, newFileName);
  }
});


const multerConfig = {
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Allowed size of uploaded image = 5MB
  },

  fileFilter(req, file, cb) {
    const allowedFileTypes = ['.jpeg', '.png', '.jpg', '.jfif'];
    const fileExtension = path.extname(file.originalname);
    if (allowedFileTypes.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Only images of the types: [jpeg, png] are currently supported'));
    }
  }
};

export default multer(multerConfig);
