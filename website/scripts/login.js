// login.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
  
    loginForm.addEventListener('submit', (event) => {
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
  
      if (!email || !password) {
        showAlert('אנא מלא את כתובת האימייל והסיסמה.');
        event.preventDefault();
      }
    });
  });
  