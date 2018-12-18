window.onload = (e) => {
  const d = document;
  const qNavWrapper = d.getElementById('mobile-nav-sidebar__wrapper');
  const qNavMenuWrapper = d.querySelector('.sidebar-menu__wrapper');
  const closeNavBtn = d.querySelector('#mobile-nav-sidebar__close-btn');

  qNavWrapper.onclick = (e) => {
    qNavMenuWrapper.classList.add('nav-menu-show');
  }

  closeNavBtn.onclick = (e) => {
    qNavMenuWrapper.classList.remove('nav-menu-show');
  }

  document.onkeydown = (e) => {
    if (e.key === 'Escape') {
      qNavMenuWrapper.classList.remove('nav-menu-show');
    }
  }
}