const pToggleBtns = document.querySelectorAll(".toggle-password-visibility");
const passwordVisible = false;

// adds toggle password functionality
for (let i = 0; i < pToggleBtns.length; i++) {
  const toggleBtn = pToggleBtns[i];
  toggleBtn.setAttribute('p-visible', passwordVisible);
  toggleBtn.onclick = function () {
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


const passwordValidationMsg = document.querySelector('.pwd-validation-error-msg');
const mainPasswdField = document.querySelector('input[id=pwd]');
const confirmPasswdField = document.querySelector('input[id=c-pwd]');

const mainPasswdFieldValue = mainPasswdField.value;
confirmPasswdField.oninput = function () {
  if (this.value !== mainPasswdFieldValue) {
    passwordValidationMsg.textContent = 'passwords does not match';
  } else {
    passwordValidationMsg.textContent = '';
  }
}

const matchPasswords = (val1, value2) => {

}