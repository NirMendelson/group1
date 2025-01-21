document.addEventListener('DOMContentLoaded', () => {
    const deliveryForm = document.getElementById('delivery-form');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    const loadingContainer = document.getElementById('loading-container');
    const loadingMessage = document.getElementById('loading-message');

    deliveryForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        const supermarket = document.getElementById('supermarket').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;

        // Clear previous error messages
        errorMessage.textContent = '';
        errorMessage.style.opacity = '0';

        // Validate required fields
        if (!supermarket || !date || !time) {
            errorMessage.textContent = 'אנא מלא את כל השדות';
            errorMessage.style.opacity = '1';
            setTimeout(() => {
                errorMessage.style.opacity = '0';
            }, 4000);
            return;
        }

        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        if (selectedDate < tomorrow) {
            errorMessage.textContent = 'אנא בחר תאריך עתידי בלבד (ממחר והלאה)';
            errorMessage.style.opacity = '1';
            setTimeout(() => {
                errorMessage.style.opacity = '0';
            }, 4000);
            return;
        }

        // Show loading animation
        loadingContainer.style.display = 'flex';
        loadingMessage.textContent = 'שולח את פרטי המשלוח...';

        // Prepare the data to send to the backend
        const deliveryData = {
            supermarket,
            date,
            time,
        };

        try {
            // Send the data to the server using fetch
            const response = await fetch('/delivery/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(deliveryData),
            });
            

            if (!response.ok) {
                throw new Error('Failed to upload delivery data');
            }

            const result = await response.json();

            // Display success message
            successMessage.textContent = result.message;
            successMessage.style.opacity = '1';

            // Hide loading animation
            loadingContainer.style.display = 'none';

            // Reset the form
            deliveryForm.reset();

            // Hide success message after 4 seconds
            setTimeout(() => {
                successMessage.style.opacity = '0';
            }, 4000);
        } catch (error) {
            // Display error message
            errorMessage.textContent = 'אירעה שגיאה בשליחת הנתונים, אנא נסה שוב';
            errorMessage.style.opacity = '1';

            // Hide loading animation
            loadingContainer.style.display = 'none';
        }
    });
});
