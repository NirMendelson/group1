document.addEventListener('DOMContentLoaded', () => {
    const deliveryForm = document.getElementById('delivery-form');
    const dateSelect = document.getElementById('date');
    const timeSelect = document.getElementById('time');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    const loadingContainer = document.getElementById('loading-container');
    const loadingMessage = document.getElementById('loading-message');

    // --- Populate Date Options ---
    function populateDateOptions() {
        const today = new Date();
        let daysAdded = 0;
        let offset = 1; // Start from tomorrow

        while (daysAdded < 7) {
            const future = new Date(today);
            future.setDate(today.getDate() + offset);

            // day: 0=Sunday, 1=Monday, ... 5=Friday, 6=Saturday
            const dayOfWeek = future.getDay();

            // Skip Saturdays (dayOfWeek === 6)
            if (dayOfWeek !== 6) {
                const option = document.createElement('option');
                const day = future.getDate().toString().padStart(2, '0');
                const month = (future.getMonth() + 1).toString().padStart(2, '0');
                const year = future.getFullYear();

                // For consistent server processing, use YYYY-MM-DD as the 'value'
                option.value = `${year}-${month}-${day}`;
                // Show dd.mm.yyyy in the dropdown text
                option.textContent = `${day}.${month}.${year}`;
                dateSelect.appendChild(option);

                daysAdded++;
            }
            offset++;
        }
    }

    // --- Populate Time Options ---
    // We'll handle Friday differently (up to 13:00) vs. other days (up to 21:00).
    function populateTimeOptions(selectedDate) {
        // Clear out existing options
        timeSelect.innerHTML = '';
        // Put a default option back
        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = 'בחר שעה';
        timeSelect.appendChild(placeholder);

        if (!selectedDate) {
            return; // If no date selected yet, don't fill times
        }

        const dateObj = new Date(selectedDate);
        const weekday = dateObj.getDay(); // 0=Sunday, 1=Monday, ... 4=Thursday, 5=Friday, 6=Saturday

        // If Friday => last hour is 13, else => last hour is 21
        const lastHour = (weekday === 5) ? 13 : 21;

        for (let hour = 8; hour <= lastHour; hour++) {
            // If it's Friday and hour==13, only "13:00" is valid (not 13:15, 13:30, 13:45)
            const minuteIntervals = (weekday === 5 && hour === 13)
                ? [0]  // Only "13:00"
                : [0, 15, 30, 45];

            for (let minute of minuteIntervals) {
                const hh = hour.toString().padStart(2, '0');
                const mm = minute.toString().padStart(2, '0');
                const timeValue = `${hh}:${mm}`;
                const option = document.createElement('option');
                option.value = timeValue;
                option.textContent = timeValue;
                timeSelect.appendChild(option);
            }
        }
    }

    // On page load
    populateDateOptions();

    // Whenever the user changes the date, re-populate time options accordingly
    dateSelect.addEventListener('change', () => {
        const chosenDate = dateSelect.value; // "YYYY-MM-DD"
        populateTimeOptions(chosenDate);
    });

    // Form submission handler
    deliveryForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const supermarket = document.getElementById('supermarket').value;
        const date = dateSelect.value;
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

        // Validate date range (1 <= date <= 30 days from now)
        const selectedDate = new Date(date);
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);

        const maxDate = new Date();
        maxDate.setDate(todayDate.getDate() + 30);

        if (selectedDate < todayDate || selectedDate > maxDate) {
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
