window.onload = (e) => {
  const d = document;
  const qNavMenuWrapper = d.querySelector('.sidebar-menu__wrapper');
  // const closeNavBtn = d.querySelector('#mobile-nav-sidebar__close-btn');

  const qNavMenuIconWrapper = document.querySelector('#mobile-nav-sidebar__wrapper');

  // qNavWrapper.onclick = (e) => {
  //   qNavMenuWrapper.classList.add('nav-menu-show');
  // }

  // closeNavBtn.onclick = (e) => {
  //   qNavMenuWrapper.classList.remove('nav-menu-show');
  // }

  document.onkeydown = (e) => {
    if (e.key === 'Escape') {
      qNavMenuWrapper.classList.remove('nav-menu-show');
    }
  }

  qNavMenuIconWrapper.onclick = function(e) {
    this.classList.toggle("change");
    qNavMenuWrapper.classList.toggle('nav-menu-show');
  }
}