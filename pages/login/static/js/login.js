document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.createElement('div');
    const successMessage = document.createElement('div');

    // Add error and success messages dynamically
    errorMessage.className = 'error-message';
    successMessage.className = 'success-message';
    loginForm.appendChild(errorMessage);
    loginForm.appendChild(successMessage);

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            errorMessage.textContent = 'אנא מלא את כל הפרטים';
            errorMessage.style.opacity = '1';
            setTimeout(() => (errorMessage.style.opacity = '0'), 4000);
            return;
        }

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();
            if (result.success) {
                successMessage.textContent = 'ההתחברות הושלמה';
                successMessage.classList.add('show');
                setTimeout(() => {
                    window.location.href = '/'; 
                }, 2000);
            } else {
                errorMessage.textContent = result.message;
                errorMessage.style.opacity = '1';
                setTimeout(() => (errorMessage.style.opacity = '0'), 4000);
            }
        } catch (error) {
            errorMessage.textContent = 'שגיאה בשרת. נסה שוב מאוחר יותר.';
            errorMessage.style.opacity = '1';
            setTimeout(() => (errorMessage.style.opacity = '0'), 4000);
        }
    });

    // Clear custom validation messages on input
    [emailInput, passwordInput].forEach((input) => {
        input.addEventListener('input', () => {
            input.setCustomValidity('');
        });
    });
});
