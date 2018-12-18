window.onload = (e) => {
  const d = document;
  const modalOverlay = d.querySelector('.modal-overlay');

  // comments modal
  const cModal = d.getElementById('comments-modal');
  const cModalOverlay = d.getElementById('c-modal-overlay');
  const cCloseBtn = d.getElementById('close-modal-btn-comment');
  const cDialog = d.getElementById('c-modal-dialog');
  const cModalTriggerBtn = d.querySelector('.question-card__img > button');

  // Questions modal
  const qModal = d.getElementById('questions-modal');
  const qModalOverlay = d.getElementById('q-modal-overlay');
  const qDialog = d.getElementById('q-modal-dialog');
  const qCloseBtn = d.querySelector('#close-modal-btn-question');
  const qModalTriggerBtn = d.querySelector('.ask-group-btn');

  function hideModal(modal) {
    modal.classList.remove('open-modal');
    modal.classList.add('close-modal');
  }

  function showModal(modal) {
    modal.classList.remove('close-modal');
    modal.classList.add('open-modal');
  }

  cDialog.onclick = (e) => {
    e.stopPropagation();
  }

  qDialog.onclick = (e) => {
    e.stopPropagation();
  }

  d.onkeydown = (e) => {
    if (e.key === 'Escape') {
      hideModal(cModal);
      hideModal(qModal);
    }
  }

  cCloseBtn.onclick = (e) => {
    hideModal(cModal);
  }

  qCloseBtn.onclick = (e) => {
    hideModal(qModal);
  }

  cModalTriggerBtn.onclick = (e) => {
    showModal(cModal);
  }

  qModalTriggerBtn.onclick = (e) => {
    showModal(qModal);
  }

  cModalOverlay.onclick = (e) => {
    hideModal(cModal);
  }

  qModalOverlay.onclick = (e) => {
    hideModal(qModal);
  }
}

