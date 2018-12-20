(() => {
  const d = document;

  // comments modal
  const commentModal = d.getElementById('comments-modal');
  const commentModalOverlay = d.getElementById('c-modal-overlay');
  const commentCloseBtn = d.getElementById('close-modal-btn-comment');
  const commentModalDialog = d.getElementById('c-modal-dialog');
  const commentModalTriggerBtn = d.querySelector('.question-card__img > button');

  // Questions modal
  const questionModal = d.getElementById('questions-modal');
  const questionModalOverlay = d.getElementById('q-modal-overlay');
  const questionModalDialog = d.getElementById('q-modal-dialog');
  const questionModalCloseBtn = d.querySelector('#close-modal-btn-question');
  const questionModalTriggerBtn = d.querySelector('.ask-group-btn');

  function hideModal(modal) {
    modal.classList.remove('enabled');
    modal.classList.add('disabled');
  }

  function showModal(modal) {
    modal.classList.remove('disabled');
    modal.classList.add('enabled');
  }

  commentModalDialog.onclick = (e) => {
    e.stopPropagation();
  }

  questionModalDialog.onclick = (e) => {
    e.stopPropagation();
  }

  d.onkeydown = (e) => {
    if (e.key === 'Escape') {
      hideModal(commentModal);
      hideModal(questionModal);
    }
  }

  commentCloseBtn.onclick = (e) => {
    hideModal(commentModal);
  }

  questionModalCloseBtn.onclick = (e) => {
    hideModal(questionModal);
  }

  commentModalTriggerBtn.onclick = (e) => {
    showModal(commentModal);
  }

  questionModalTriggerBtn.onclick = (e) => {
    showModal(questionModal);
  }

  commentModalOverlay.onclick = (e) => {
    hideModal(commentModal);
  }

  questionModalOverlay.onclick = (e) => {
    hideModal(questionModal);
  }
})();