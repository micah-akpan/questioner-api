import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.resolve(__dirname, '../', '../', 'assets'));
  },
  filename(req, file, cb) {
    crypto.randomBytes(16, (err, raw) => {
      if (err) return cb(err, null);
      cb(null, `${raw.toString('hex')}${path.extname(file.originalname)}`);
    });
  }
});

export default multer({ storage });
