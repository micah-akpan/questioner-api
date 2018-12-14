const pToggleBtns = document.querySelectorAll(".toggle-password-visibility");
let passwordVisible = false;

for (let i = 0; i < pToggleBtns.length; i++) {
  const toggleBtn = pToggleBtns[i];
  toggleBtn.setAttribute('p-visible', passwordVisible);
  toggleBtn.onclick = function() {
    if (this.getAttribute('p-visible') === true) {

      const inputEl = this.parentElement.querySelector('input');
      inputEl.type = 'password';
      this.textContent = 'show';

      this.setAttribute('p-visible', false);
    } else {
      
      const inputEl = this.parentElement.querySelector('input');
      inputEl.type = 'text';

      this.textContent = 'hide';
      this.setAttribute('p-visible', true);
    }
  }
}