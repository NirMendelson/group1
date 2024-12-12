document.addEventListener('DOMContentLoaded', () => {
    const deliveryForm = document.getElementById('delivery-form');
    const errorMessage = document.getElementById('error-message');

    deliveryForm.addEventListener('submit', (event) => {
        const supermarket = document.getElementById('supermarket').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;

        // Clear previous messages
        errorMessage.textContent = '';
        errorMessage.style.opacity = '0';
        const successMessage = document.getElementById('success-message');
        successMessage.textContent = '';
        successMessage.classList.remove('show'); // Ensure hidden initially

        // Check if any fields are empty
        if (!supermarket || !date || !time) {
            event.preventDefault(); // Prevent form submission
            errorMessage.textContent = 'אנא מלא את כל השדות';
            errorMessage.style.opacity = '1';

            // Fade the error message after 4 seconds
            setTimeout(() => {
                errorMessage.style.opacity = '0';
            }, 4000);
            return;
        }

        // Check if the selected date is in the past
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Remove time portion to only compare dates

        if (selectedDate < today) {
            event.preventDefault(); // Prevent form submission
            errorMessage.textContent = 'אנא בחר תאריך עתידי';
            errorMessage.style.opacity = '1';

            // Fade the error message after 4 seconds
            setTimeout(() => {
                errorMessage.style.opacity = '0';
            }, 4000);
            return;
        }

        // If all checks pass, show success message
        event.preventDefault(); // Prevent form submission for demo
        console.log('Success message logic triggered'); // Debugging statement
        successMessage.textContent = 'המשלוח נוצר בהצלחה';
        successMessage.classList.add('show');

        // Fade the success message after 4 seconds
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 4000);
    });
});
