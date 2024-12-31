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

    loginForm.addEventListener('submit', (event) => {
        // Reset previous validation messages
        emailInput.setCustomValidity('');
        passwordInput.setCustomValidity('');
        errorMessage.textContent = '';
        errorMessage.style.opacity = '0';
        successMessage.textContent = '';
        successMessage.classList.remove('show');

        let valid = true;

        // Validate email
        if (!emailInput.validity.valid) {
            emailInput.setCustomValidity('Please enter a valid email address.');
            emailInput.reportValidity();
            valid = false;
        }

        // Validate password
        const passwordValue = passwordInput.value.trim();
        if (
            valid &&
            (!/^.{8,}$/.test(passwordValue) || // Minimum 8 characters
                !/[a-zA-Z]/.test(passwordValue) || // At least one letter
                !/\d/.test(passwordValue)) // At least one number
        ) {
            passwordInput.setCustomValidity(
                'Password must be at least 8 characters long and include at least one letter and one number.'
            );
            passwordInput.reportValidity();
            valid = false;
        }

        if (!valid) {
            // Show error message
            event.preventDefault();
            errorMessage.textContent = 'אנא מלא את כל הפרטים';
            errorMessage.style.opacity = '1';
            setTimeout(() => {
                errorMessage.style.opacity = '0';
            }, 4000);
        } else {
            // Show success message and redirect
            event.preventDefault();
            successMessage.textContent = 'ההתחברות הושלמה';
            successMessage.classList.add('show');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    });

    // Clear custom validation messages on input
    [emailInput, passwordInput].forEach((input) => {
        input.addEventListener('input', () => {
            input.setCustomValidity('');
        });
    });
});
