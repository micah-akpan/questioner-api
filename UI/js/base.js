const pToggleBtns = document.querySelectorAll(".toggle-password-visibility");
let passwordVisible = false;

for (let i = 0; i < pToggleBtns.length; i++) {
  const toggleBtn = pToggleBtns[i];
  toggleBtn.setAttribute('p-visible', passwordVisible);
  toggleBtn.onclick = function() {
      const inputEl = this.parentElement.querySelector('input');
      
      if (inputEl.type === 'password') {
        inputEl.type = 'text';
        this.textContent = 'hide';
      } else {
        inputEl.type = 'password';
        this.textContent = 'show';
      }
    }
}