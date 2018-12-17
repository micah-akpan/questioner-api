const modalCloseBtn = document.getElementById('close-modal-btn');
const modal = document.getElementById('modal');
const questionModalTriggerBtn = document.querySelector('.ask-group-btn');

function hideModal(modal) {
  modal.classList.remove('open-modal');
  modal.classList.add('close-modal');
}

function showModal(modal) {
  modal.classList.remove('close-modal');
  modal.classList.add('open-modal');
}

document.onkeydown = function (e) {
  if (e.key === 'Escape') {
    hideModal(modal);
  }
}

modalCloseBtn.onclick = function (e) {
  hideModal(modal);
}

questionModalTriggerBtn.onclick = function (e) {
  showModal(modal);
}
