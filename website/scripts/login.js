document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.createElement('div');
    const successMessage = document.createElement('div');

    // Add dynamic error and success messages
    errorMessage.className = 'error-message';
    successMessage.className = 'success-message';
    loginForm.appendChild(errorMessage);
    loginForm.appendChild(successMessage);

    loginForm.addEventListener('submit', (event) => {
        // Clear any previous custom validation messages
        emailInput.setCustomValidity('');
        passwordInput.setCustomValidity('');
        errorMessage.textContent = '';
        errorMessage.style.opacity = '0';
        successMessage.textContent = '';
        successMessage.classList.remove('show');

        let valid = true;

        // Validate email using built-in browser validation
        const emailValue = emailInput.value.trim();
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
            event.preventDefault(); // Prevent form submission if any validation fails
            errorMessage.textContent = 'אנא מלא את כל הפרטים';
            errorMessage.style.opacity = '1';

            // Fade the error message after 4 seconds
            setTimeout(() => {
                errorMessage.style.opacity = '0';
            }, 4000);
        } else {
            event.preventDefault(); // Prevent default form submission for demo
            successMessage.textContent = 'ההתחברות הושלמה';
            successMessage.classList.add('show');

            // Redirect to homepage after 3 seconds
            setTimeout(() => {
                window.location.href = 'index.html'; // Replace with the actual path to your homepage
            }, 2000);
        }
    });

    // Clear custom messages on input changes
    [emailInput, passwordInput].forEach((input) => {
        input.addEventListener('input', () => {
            input.setCustomValidity('');
        });
    });
});
