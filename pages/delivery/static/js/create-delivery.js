document.addEventListener('DOMContentLoaded', () => {
    const deliveryForm = document.getElementById('delivery-form');
    const timeSelect = document.getElementById('time');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    const loadingContainer = document.getElementById('loading-container');
    const loadingMessage = document.getElementById('loading-message');

    // Populate the time dropdown with allowed times (08:00 - 21:00 with 15-minute intervals)
    function populateTimeOptions() {
        for (let hour = 8; hour <= 21; hour++) {
            for (let minute of ["00", "15", "30", "45"]) {
                const timeValue = `${hour.toString().padStart(2, '0')}:${minute}`;
                const option = document.createElement('option');
                option.value = timeValue;
                option.textContent = timeValue;
                timeSelect.appendChild(option);
            }
        }
    }

    populateTimeOptions(); // Call function to generate time options

    deliveryForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const supermarket = document.getElementById('supermarket').value;
        const date = document.getElementById('date').value;
        const time = timeSelect.value;

        errorMessage.textContent = '';
        errorMessage.style.opacity = '0';

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

        const maxDate = new Date();
        maxDate.setDate(today.getDate() + 30);

        if (selectedDate < today || selectedDate > maxDate) {
            errorMessage.textContent = 'תאריך המשלוח חייב להיות בטווח של 30 הימים הקרובים.';
            errorMessage.style.opacity = '1';
            setTimeout(() => {
                errorMessage.style.opacity = '0';
            }, 4000);
            return;
        }

        loadingContainer.style.display = 'flex';
        loadingMessage.textContent = 'שולח את פרטי המשלוח...';

        const deliveryData = { supermarket, date, time };

        try {
            const response = await fetch('/delivery/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(deliveryData),
            });

            const result = await response.json();

            if (response.status === 401) {
                errorMessage.textContent = result.error || 'הירשם או התחבר כדי לבצע הזמנה';
                errorMessage.style.opacity = '1';
            } else if (response.status === 400) {
                errorMessage.textContent = result.error;
                errorMessage.style.opacity = '1';
            } else if (!response.ok) {
                throw new Error('Failed to upload delivery data');
            } else {
                successMessage.textContent = result.message;
                successMessage.style.opacity = '1';
                deliveryForm.reset();
                setTimeout(() => { successMessage.style.opacity = '0'; }, 4000);
            }
        } catch (error) {
            errorMessage.textContent = 'אירעה שגיאה בשליחת הנתונים, אנא נסה שוב';
            errorMessage.style.opacity = '1';
        } finally {
            loadingContainer.style.display = 'none';
        }
    });
});
