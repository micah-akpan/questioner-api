const modalCloseBtn = document.getElementById('close-modal-btn');
const modal = document.getElementById('modal');

function hideModal(modal) {
  modal.classList.add('close-modal');
}

document.onkeydown = function (e) {
  if (e.key === 'Escape') {
    hideModal(modal);
  }
}

modalCloseBtn.onclick = function (e) {
  if (!modal.classList.contains('close-modal')) {
    modal.classList.add('close-modal');
  }
}