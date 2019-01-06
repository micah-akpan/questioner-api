/* eslint-disable */

const
  tabListItems = document.querySelectorAll('.nav__profile-tablist li'),
  userAcctArea = document.querySelector('.user-profile__main-content__wrapper'),
  userAcctProfileMain = document.querySelector('#user-profile__main'),
  userAcctAvatarWrapper = document.querySelector('.user-profile__avatar-wrapper'),
  userTopFeeds = document.querySelector('.user-feeds__wrapper'),
  mainContainer = document.querySelector('.user-profile__main-content__wrapper');

// tabs
const
  profile = tabListItems[0],
  feeds = tabListItems[1],
  stats = tabListItems[2],
  support = tabListItems[3];


tabListItems.forEach((listItem) => {
  listItem.onclick = () => {
   if (listItem.textContent.trim().toLowerCase() === 'feeds') {
     
     userAcctArea.style.display = 'none';
     userAcctAvatarWrapper.style.display = 'none';
     userTopFeeds.style.display = 'block';
     mainContainer.style.border = '0';
   } else if (listItem.textContent.trim().toLowerCase() === 'profile') {
     userTopFeeds.style.display = 'none';
     userAcctArea.style.display = 'block';
     userAcctAvatarWrapper.style.display = 'block';
     mainContainer.style.border = '';
   }
    tabListItems.forEach((item) => {
      item.removeAttribute('class');
    });

    listItem.setAttribute('class', 'active');
  }
});

