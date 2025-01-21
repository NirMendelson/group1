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

    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Reset validation messages and feedback
        [emailInput, passwordInput, cityInput, streetInput, numberInput, nameInput].forEach(input => input.setCustomValidity(''));
        errorMessage.textContent = '';
        errorMessage.style.opacity = '0';
        successMessage.textContent = '';
        successMessage.classList.remove('show');

        let valid = true;

        // Check if all fields are filled
        const inputs = [phoneInput, emailInput, nameInput, passwordInput, numberInput, streetInput, cityInput];
        for (const input of inputs) {
            if (!input.value.trim()) {
                input.setCustomValidity('This field cannot be left empty.');
                input.reportValidity();
                valid = false;
                break;
            }
        }

        // Validate phone number
        if (valid && !/^[0]\d+$/.test(phoneInput.value.trim())) {
            phoneInput.setCustomValidity('Phone number must start with 0 and contain only digits.');
            phoneInput.reportValidity();
            valid = false;
        }

        // Validate email
        if (valid && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
            emailInput.setCustomValidity('Please enter a valid email address with "@" and a domain (e.g., .com).');
            emailInput.reportValidity();
            valid = false;
        }

        // Validate password
        if (valid && (!/^.{8,}$/.test(passwordInput.value.trim()) || !/[a-zA-Z]/.test(passwordInput.value.trim()) || !/\d/.test(passwordInput.value.trim()))) {
            passwordInput.setCustomValidity('Password must be at least 8 characters long and include at least one letter and one number.');
            passwordInput.reportValidity();
            valid = false;
        }

        // Validate supermarket selection
        if (valid && !supermarketSelect.value.trim()) {
            supermarketSelect.setCustomValidity('Please select a preferred supermarket.');
            supermarketSelect.reportValidity();
            valid = false;
        }

        // Validate city contains only Hebrew letters
        if (valid && !/^[\u0590-\u05FF\s]+$/.test(cityInput.value.trim())) {
            cityInput.setCustomValidity('City must contain only Hebrew letters.');
            cityInput.reportValidity();
            valid = false;
        }

        // Validate street contains only Hebrew letters
        if (valid && !/^[\u0590-\u05FF\s]+$/.test(streetInput.value.trim())) {
            streetInput.setCustomValidity('Street must contain only Hebrew letters.');
            streetInput.reportValidity();
            valid = false;
        }

        // Validate number contains only digits
        if (valid && !/^\d+$/.test(numberInput.value.trim())) {
            numberInput.setCustomValidity('Number must contain only numeric digits.');
            numberInput.reportValidity();
            valid = false;
        }

        // Validate name contains only Hebrew letters
        if (valid && !/^[\u0590-\u05FF\s]+$/.test(nameInput.value.trim())) {
            nameInput.setCustomValidity('Name must contain only Hebrew letters.');
            nameInput.reportValidity();
            valid = false;
        }

        if (!valid) {
            errorMessage.textContent = 'אנא מלא את כל הפרטים';
            errorMessage.style.opacity = '1';
            setTimeout(() => {
                errorMessage.style.opacity = '0';
            }, 4000);
            return;
        }

        // Collect form data
        const formData = {
            phone: phoneInput.value.trim(),
            email: emailInput.value.trim(),
            name: nameInput.value.trim(),
            password: passwordInput.value.trim(),
            number: numberInput.value.trim(),
            street: streetInput.value.trim(),
            city: cityInput.value.trim(),
            supermarket: supermarketSelect.value.trim()
        };

        try {
            // Send data to the backend
            const response = await fetch('/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            if (response.ok) {
                successMessage.textContent = result.success;
                successMessage.classList.add('show');
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            } else {
                errorMessage.textContent = result.error || 'An error occurred. Please try again.';
                errorMessage.style.opacity = '1';
                setTimeout(() => {
                    errorMessage.style.opacity = '0';
                }, 4000);
            }
        } catch (error) {
            errorMessage.textContent = 'Failed to sign up. Please try again.';
            errorMessage.style.opacity = '1';
            setTimeout(() => {
                errorMessage.style.opacity = '0';
            }, 4000);
        }
    });

    // Clear validation messages on input changes
    [phoneInput, emailInput, passwordInput, supermarketSelect, cityInput, streetInput, numberInput, nameInput].forEach(input => {
        input.addEventListener('input', () => input.setCustomValidity(''));
    });
});
