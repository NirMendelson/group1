// signup.js
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const phoneInput = document.getElementById('phone');
  
    signupForm.addEventListener('submit', (event) => {
      const phoneValue = phoneInput.value.trim();
  
      if (!/^[0]\d+$/.test(phoneValue)) {
        showAlert('מספר הטלפון חייב להתחיל ב-0 ולכלול רק ספרות.');
        event.preventDefault();
      }
    });
  });
  