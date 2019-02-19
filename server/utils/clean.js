/**
 * @module simple util module that purges the 'assets' folder
 * where multer keeps a copy of an uploaded image
 */

const fs = require('fs');
const path = require('path');

const clean = () => {
  const filePath = path.resolve(__dirname, '../', 'assets');
  fs.readdir(filePath, (err, files) => {
    if (err) {
      process.exit(1);
    }
    for (let i = 0, nFiles = files.length; i < nFiles; i += 1) {
      const file = files[i];
      // `yoyo.jpeg` is required for testing purposes
      if (file !== 'yoyo.jpeg') {
        fs.unlinkSync(`${filePath}/${file}`);
      }
    }
  });
};

clean();
