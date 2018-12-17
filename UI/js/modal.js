const modalCloseBtn = document.getElementById('close-modal-btn');
const modal = document.getElementById('modal');

modalCloseBtn.onclick = function(e) {
  modal.classList.add('close-modal');
}