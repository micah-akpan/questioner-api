import { v2 as cloudinary } from 'cloudinary';
import bluebird from 'bluebird';

bluebird.promisifyAll(cloudinary.uploader);

/* eslint-disable */

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const uploadOptions = {
  folder: 'assets/images/',
  use_filename: true,
  unique_filename: false
};

export default {
  /**
  * @func uploadImage
  * @param {String} image
  * @returns {Promise} Returns an upload result object
  * @description Uploads `image` to cloud storage
  * on cloudinary
  */
  uploadImage(image) {
    return cloudinary.uploader.uploadAsync(image, uploadOptions)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      })
  },

  /**
   * @func uploadImages
   * @param {Array} images
   * @returns {Promise<Array>} Resolves to an array of the results of the upload images
   * @description Uploads images to cloud storage
   * on cloudinary
   */
  async uploadImages(images) {
    const uploadedImages = [];
    for (const image of images) {
      const uploadedImage = await this.uploadImage(image);
      uploadedImages.push(uploadedImage);
    }

    return uploadedImages;
  }
};
