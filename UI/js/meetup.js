
(() => {

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

  // Tags
  const addTagBtn = d.querySelector('.btn__tag');
  const tagField = d.querySelector('input[id="tag"]');
  const addTagsContainer = d.querySelector('.meetup-tags-added');

  let tags = null;

  addTagBtn.onclick = (e) => {
    // allowed separators for tags are commas and hashes (#)
    tags = tagField.value.split(",");
    if (tags.length === 1 && tags[0].includes('#')) {
      tags = tags[0].split('#');
    }

    addTagsContainer.innerHTML = "";
    tags.forEach((tag, i) => {
      if (tag !== '') {
        const span = d.createElement('span');

        // to support deleting the tags later
        span.id = i;
        span.textContent = `#${tag}`;
        addTagsContainer.appendChild(span);
      }
    })
  }
})();