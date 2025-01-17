document.addEventListener('DOMContentLoaded', () => {
    const deliveryForm = document.getElementById('delivery-form');
    const errorMessage = document.getElementById('error-message');
    const loadingContainer = document.getElementById('loading-container');
    const loadingMessage = document.getElementById('loading-message');

    deliveryForm.addEventListener('submit', (event) => {
        const supermarket = document.getElementById('supermarket').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;

        // Clear previous error messages
        errorMessage.textContent = '';
        errorMessage.style.opacity = '0';

        // Validate required fields
        if (!supermarket || !date || !time) {
            event.preventDefault();
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

        // Check that the selected date is tomorrow or later
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        if (selectedDate < tomorrow) {
            event.preventDefault();
            errorMessage.textContent = 'אנא בחר תאריך עתידי בלבד (ממחר והלאה)';
            errorMessage.style.opacity = '1';
            setTimeout(() => {
                errorMessage.style.opacity = '0';
            }, 4000);
            return;
        }

        // Show loading animation
        event.preventDefault();
        loadingContainer.style.display = 'flex';

        // Display loading messages in sequence
        const messages = [
            'נתונים התקבלו',
            'שולח התראות למשתמשים בסביבתך',
            'פרטי המשלוח נשלחו, משתמשים שרוצים להצטרף להזמנה יצרו איתך קשר',
        ];
        let messageIndex = 0;

        loadingMessage.textContent = messages[messageIndex];

        const changeMessage = setInterval(() => {
            messageIndex++;
            if (messageIndex < messages.length) {
                loadingMessage.textContent = messages[messageIndex];
            } else {
                clearInterval(changeMessage);
                loadingContainer.style.display = 'none';
                deliveryForm.reset();
            }
        }, 2000);
    });
});
