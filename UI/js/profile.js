/* eslint-disable */

const tabListItems = document.querySelectorAll('.nav__profile-tablist li');


tabListItems.forEach((listItem) => {
  listItem.onclick = () => {
    tabListItems.forEach((item) => {
      item.removeAttribute('class');
    });

    listItem.setAttribute('class', 'active');
  }
});

