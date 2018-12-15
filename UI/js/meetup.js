const searchIcon = document.getElementById('search-icon');
const searchBar = document.getElementById('search-bar');

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
    if (searchBar.style.display === 'inline-block') {
      searchBar.style.display = 'none';
    } else {
      return;
    }
  }
}