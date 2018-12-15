const searchIcon = document.getElementById('search-icon');
const searchBar = document.getElementById('search-bar');

const btnTrigger = document.querySelector('.dropdown-trigger-btn');
const dropDownMenu = document.querySelector('.q-user-profile__dropdown-menu');

// Toggle display of dropdown menu
btnTrigger.onclick = function () {
  dropDownMenu.style.display === 'none' ? dropDownMenu.style.display = 'block' : dropDownMenu.style.display = 'none';
}

searchIcon.onclick = () => {
  // TODO: Remove inline styling
  searchBar.style.width = '300px';
  searchBar.style.display = 'inline-block';
}

// close search bar
document.addEventListener('keydown', (e) => {
  hideSearchBar(e.key);
})

function hideSearchBar(keyPressed) {
  if (keyPressed === 'Escape') {
    if (searchBar.style.display === 'inline-block' || dropDownMenu.style.display === 'block') {
      searchBar.style.display = 'none';
      dropDownMenu.style.display = 'none';
    } else {
      return;
    }
  }
}

document.addEventListener('click', (e) => {
})
