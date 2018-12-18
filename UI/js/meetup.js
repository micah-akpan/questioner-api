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

document.addEventListener('click', (e) => {
})
