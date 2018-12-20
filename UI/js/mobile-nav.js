window.onload = (e) => {

  const 
    qNavMenuWrapper = document.querySelector('.sidebar-menu__wrapper'),
    qNavMenuIconWrapper = document.querySelector('#mobile-nav-sidebar__wrapper');

  document.onkeydown = (e) => {
    if (e.key === 'Escape') {
      qNavMenuWrapper.classList.remove('nav-menu-show')
        ;
      qNavMenuIconWrapper.classList.toggle('change');
    }
  }

  qNavMenuIconWrapper.onclick = function (e) {
    this.classList.toggle('change');
    qNavMenuWrapper.classList.toggle('nav-menu-show');
  }
}