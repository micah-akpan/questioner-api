const searchIcon = document.getElementById('search-icon');
const searchBar = document.getElementById('search-bar');

const btnTrigger = document.querySelector('.dropdown-trigger-btn');
const dropDownMenu = document.querySelector('.q-user-profile__dropdown-menu');

// Toggle display of dropdown menu
btnTrigger.onclick = function () {
  dropDownMenu.style.display === 'none' ? dropDownMenu.style.display = 'block' : dropDownMenu.style.display = 'none';
}

searchIcon.onclick = () => {
  searchBar.classList.add('show');
}

// close search bar
document.addEventListener('keydown', (e) => {
  hideSearchBar(e.key);
})

function hideSearchBar(keyPressed) {
  if (keyPressed === 'Escape') {
    searchBar.classList.remove('show')
  }
}

const d = document;

const meetupDropdownTrigger = d.querySelector('.q-card__primary-options');
const meetupDropdownMenu = d.querySelector('.q-card__primary-options .dropdown-menu');
const delBtn = d.querySelector('.dropdown-menu .delete-option');
const editBtn = d.querySelector('.dropdown-menu .edit-option');


meetupDropdownTrigger.onclick = (e) => {
  meetupDropdownMenu.classList.toggle('active');
}

delBtn.onclick = (e) => {
  // pop open delete modal
}
