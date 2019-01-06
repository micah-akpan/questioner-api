/* eslint-disable */

const
  tabListItems = document.querySelectorAll('.nav__profile-tablist li'),
  userAcctArea = document.querySelector('.user-profile__main-content__wrapper'),
  userAcctProfileMain = document.querySelector('#user-profile__main'),
  userAcctAvatarWrapper = document.querySelector('.user-profile__avatar-wrapper'),
  userTopFeeds = document.querySelector('.user-feeds__wrapper'),
  mainContainer = document.querySelector('.user-profile__main-content__wrapper'),
  userFeedsList = document.querySelector('.user-feeds');

// tabs
const
  profile = tabListItems[0],
  feeds = tabListItems[1],
  stats = tabListItems[2],
  support = tabListItems[3];

tabListItems.forEach((listItem) => {
  listItem.onclick = () => {
    if (listItem.textContent.trim().toLowerCase() === 'feeds') {


      userAcctArea.classList.add('n-active-block');
      userAcctAvatarWrapper.classList.add('n-active-block');

      userTopFeeds.classList.remove('n-active-block');
      userTopFeeds.classList.add('active-block');
      mainContainer.classList.add('no-border');

      userFeedsList.classList.remove('n-active-block');
      userFeedsList.classList.add('active-block');
    } else if (listItem.textContent.trim().toLowerCase() === 'profile') {
      userAcctArea.classList.remove('n-active-block');
      userAcctArea.classList.add('active-block');

      userTopFeeds.classList.remove('active-block');
      userTopFeeds.classList.add('n-active-block');
      
      userAcctAvatarWrapper.classList.remove('n-active-block');
      userAcctAvatarWrapper.classList.add('active-block');
      userFeedsList.classList.add('n-active-block');
    }
    tabListItems.forEach((item) => {
      item.removeAttribute('class');
    });

    listItem.setAttribute('class', 'active');
  }
});

