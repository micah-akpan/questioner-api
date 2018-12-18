window.onload = (e) => {
  const d = document;
  const modalCloseBtn = d.getElementById('close-modal-btn');
  const modal = d.getElementById('modal');
  const modalOverlay = d.querySelector('.modal-overlay');

  const questionModalTriggerBtn = d.querySelector('.ask-group-btn');

  function hideModal(modal) {
    modal.classList.remove('open-modal');
    modal.classList.add('close-modal');
  }

  function showModal(modal) {
    modal.classList.remove('close-modal');
    modal.classList.add('open-modal');
  }

  d.onkeydown = (e) => {
    if (e.key === 'Escape') {
      hideModal(modal);
    }
  }

  modalCloseBtn.onclick = (e) => {
    hideModal(modal);
  }

  questionModalTriggerBtn.onclick = (e) => {
    showModal(modal);
  }

  modalOverlay.onclick = (e) => {
    hideModal(modal);
  }
}

