window.onload = (e) => {
  const d = document;
  const qNavMenuWrapper = d.querySelector('.sidebar-menu__wrapper');

  const qNavMenuIconWrapper = document.querySelector('#mobile-nav-sidebar__wrapper');

  document.onkeydown = (e) => {
    if (e.key === 'Escape') {
      qNavMenuWrapper.classList.remove('nav-menu-show')
      ;
      qNavMenuIconWrapper.classList.toggle('change');
    }
  }

  qNavMenuIconWrapper.onclick = function(e) {
    this.classList.toggle("change");
    qNavMenuWrapper.classList.toggle('nav-menu-show');
  }
}