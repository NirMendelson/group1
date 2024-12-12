document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const nameInput = document.getElementById('name');
    const passwordInput = document.getElementById('password');
    const numberInput = document.getElementById('number');
    const streetInput = document.getElementById('street');
    const cityInput = document.getElementById('city');
    const supermarketSelect = document.getElementById('supermarket');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');

    signupForm.addEventListener('submit', (event) => {
        // Clear any previous custom validation messages
        emailInput.setCustomValidity('');
        passwordInput.setCustomValidity('');
        cityInput.setCustomValidity('');
        streetInput.setCustomValidity('');
        numberInput.setCustomValidity('');
        nameInput.setCustomValidity('');
        errorMessage.textContent = '';
        errorMessage.style.opacity = '0';
        successMessage.textContent = '';
        successMessage.classList.remove('show');

        let valid = true;

        // Check if all fields are filled
        const inputs = [
            phoneInput,
            emailInput,
            nameInput,
            passwordInput,
            numberInput,
            streetInput,
            cityInput,
        ];
        for (const input of inputs) {
            if (!input.value.trim()) {
                input.setCustomValidity('This field cannot be left empty.');
                input.reportValidity();
                valid = false;
                break;
            }
        }

        // Validate phone number
        const phoneValue = phoneInput.value.trim();
        if (valid && !/^[0]\d+$/.test(phoneValue)) {
            phoneInput.setCustomValidity(
                'Phone number must start with 0 and contain only digits.'
            );
            phoneInput.reportValidity();
            valid = false;
        }

        // Validate email using built-in browser validation
        if (valid && !emailInput.validity.valid) {
            emailInput.setCustomValidity('Please include a valid email address.');
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

        // Validate supermarket selection
        const supermarketValue = supermarketSelect.value.trim();
        if (valid && !supermarketValue) {
            supermarketSelect.setCustomValidity('Please select a preferred supermarket.');
            supermarketSelect.reportValidity();
            valid = false;
        }

        // Validate city contains only Hebrew letters
        const cityValue = cityInput.value.trim();
        if (valid && !/^[\u0590-\u05FF\s]+$/.test(cityValue)) {
            cityInput.setCustomValidity('City must contain only Hebrew letters.');
            cityInput.reportValidity();
            valid = false;
        }

        // Validate street contains only Hebrew letters
        const streetValue = streetInput.value.trim();
        if (valid && !/^[\u0590-\u05FF\s]+$/.test(streetValue)) {
            streetInput.setCustomValidity('Street must contain only Hebrew letters.');
            streetInput.reportValidity();
            valid = false;
        }

        // Validate number contains only digits
        const numberValue = numberInput.value.trim();
        if (valid && !/^\d+$/.test(numberValue)) {
            numberInput.setCustomValidity('Number must contain only numeric digits.');
            numberInput.reportValidity();
            valid = false;
        }

        // Validate name contains only Hebrew letters
        const nameValue = nameInput.value.trim();
        if (valid && !/^[\u0590-\u05FF\s]+$/.test(nameValue)) {
            nameInput.setCustomValidity('Name must contain only Hebrew letters.');
            nameInput.reportValidity();
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
            successMessage.textContent = 'נרשמת בהצלחה';
            successMessage.classList.add('show');

            // Redirect to homepage after 2 seconds
            setTimeout(() => {
                window.location.href = 'index.html'; // Replace with the actual path to your homepage
            }, 2000);
        }
    });

    // Clear custom messages on input changes
    const inputs = [phoneInput, emailInput, passwordInput, supermarketSelect, cityInput, streetInput, numberInput, nameInput];
    inputs.forEach((input) => {
        input.addEventListener('input', () => {
            input.setCustomValidity('');
        });
    });
});
