const d = document;

const mPhotosWrapper = d.querySelector('.meetup-photos__wrapper');
const uploadBtn = d.querySelector('label[role="button"]');
const fileInput = d.querySelector('input[type="file"]');

fileInput.onchange = (e) => {
  const image = new Image();
  const imageUrl = URL.createObjectURL(e.target.files[0]);
  image.setAttribute('src', imageUrl);
  
  mPhotosWrapper.appendChild(image);
}