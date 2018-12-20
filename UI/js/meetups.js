const d = document;

const searchIcon = d.getElementById('search-icon');
const searchBar = d.getElementById('search-bar');

const btnTrigger = d.querySelector('.dropdown-trigger-btn');
const dropDownMenu = d.querySelector('.q-user-profile__dropdown-menu');

const meetupDropdownTrigger = d.querySelector('.q-card__primary-options');
const meetupDropdownMenu = d.querySelector('.q-card__primary-options .dropdown-menu');
const delBtn = d.querySelector('.dropdown-menu .delete-option');
const editBtn = d.querySelector('.dropdown-menu .edit-option');
const modal = d.querySelector('.modal');
const closeModalBtn = d.querySelector('.close-modal-btn');

// Toggle display of dropdown menu
btnTrigger.onclick = () => {
  dropDownMenu.classList.toggle('show');
}

searchIcon.onclick = () => {
  searchBar.classList.add('show');
}

// close search bar
d.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    hideNode(searchBar, 'show');
    hideNode(modal, 'active');
  }
})

function hideNode(node, className) {
  node.classList.remove(className);
}

function showNode(node, keyPressed) {
  if (keyPressed === 'Escape') {
    node.classList.add('show');
  }
}

meetupDropdownTrigger.onclick = (e) => {
  meetupDropdownMenu.classList.toggle('active');
}

delBtn.onclick = (e) => {
  // pop open delete modal
  modal.classList.toggle('active');
}

closeModalBtn.onclick = (e) => {
  modal.classList.toggle('active');
}