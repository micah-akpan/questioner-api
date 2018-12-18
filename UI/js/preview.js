window.onload = (e) => {
  const d = document;
  const imgUploadTrigger = d.querySelector('.inner-upload__block');
  const imgUpload = d.querySelector('.q-form__image-upload');
  const imgBlock = d.querySelector('.outer-upload__block');

  imgUpload.onchange = function(e) {
    const file = URL.createObjectURL(e.target.files[0]);
    const uploadedImg = d.createElement('img');
    uploadedImg.src = file;
    uploadedImg.classList.add('upload-image-preview');
    imgBlock.innerHTML = "";
    imgBlock.appendChild(uploadedImg);
  }
}