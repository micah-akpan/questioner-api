window.onload = (e) => {
  const d = document;
  const modalCloseBtn = d.getElementById('close-modal-btn');

  // comments modal
  const cModal = d.getElementById('comments-modal');
  const qModal = d.getElementById('questions-modal');
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
      hideModal(cModal);
    }
  }

  modalCloseBtn.onclick = (e) => {
    hideModal(cModal);
  }

  questionModalTriggerBtn.onclick = (e) => {
    showModal(qModal);
  }

  modalOverlay.onclick = (e) => {
    hideModal(cModal);
  }
}

