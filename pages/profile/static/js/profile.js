document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("profile-form");
    const deleteButton = document.querySelector(".delete-btn");
    const successMessage = document.getElementById("success-message");
    const errorMessage = document.getElementById("error-message");

    const phoneInput = document.getElementById("phone");
    const nameInput = document.getElementById("name");
    const passwordInput = document.getElementById("password");
    const numberInput = document.getElementById("number");
    const streetInput = document.getElementById("street");
    const cityInput = document.getElementById("city");
    const supermarketSelect = document.getElementById("supermarket");

    // Utility to show a message
    function showMessage(element, message) {
        element.textContent = message;
        element.style.opacity = "1";
        setTimeout(() => {
            element.style.opacity = "0";
        }, 5000); // Hide after 5 seconds
    }

    // Handle profile update
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Reset validation messages
        [phoneInput, nameInput, passwordInput, numberInput, streetInput, cityInput, supermarketSelect].forEach(
            (input) => input.setCustomValidity("")
        );
        errorMessage.textContent = "";
        successMessage.textContent = "";

        let valid = true;

        // Check if all fields are filled (except password, which is optional)
        const inputs = [phoneInput, nameInput, numberInput, streetInput, cityInput, supermarketSelect];
        for (const input of inputs) {
            if (!input.value.trim()) {
                input.setCustomValidity("This field cannot be left empty.");
                input.reportValidity();
                valid = false;
                break;
            }
        }

        // Validate phone number
        if (valid && !/^[0]\d+$/.test(phoneInput.value.trim())) {
            phoneInput.setCustomValidity("Phone number must start with 0 and contain only digits.");
            phoneInput.reportValidity();
            valid = false;
        }

        // Validate supermarket selection
        if (valid && !supermarketSelect.value.trim()) {
            supermarketSelect.setCustomValidity("Please select a preferred supermarket.");
            supermarketSelect.reportValidity();
            valid = false;
        }

        // Validate city contains only Hebrew letters
        if (valid && !/^[\u0590-\u05FF\s]+$/.test(cityInput.value.trim())) {
            cityInput.setCustomValidity("City must contain only Hebrew letters.");
            cityInput.reportValidity();
            valid = false;
        }

        // Validate street contains only Hebrew letters
        if (valid && !/^[\u0590-\u05FF\s]+$/.test(streetInput.value.trim())) {
            streetInput.setCustomValidity("Street must contain only Hebrew letters.");
            streetInput.reportValidity();
            valid = false;
        }

        // Validate number contains only digits
        if (valid && !/^\d+$/.test(numberInput.value.trim())) {
            numberInput.setCustomValidity("Number must contain only numeric digits.");
            numberInput.reportValidity();
            valid = false;
        }

        // Validate name contains only Hebrew letters
        if (valid && !/^[\u0590-\u05FF\s]+$/.test(nameInput.value.trim())) {
            nameInput.setCustomValidity("Name must contain only Hebrew letters.");
            nameInput.reportValidity();
            valid = false;
        }

        if (!valid) {
            showMessage(errorMessage, "אנא מלא את כל הפרטים בצורה תקינה.");
            return;
        }

        // Prepare data for submission
        const data = {
            password: passwordInput.value.trim(), // Optional
            phone: phoneInput.value.trim(),
            name: nameInput.value.trim(),
            number: numberInput.value.trim(),
            street: streetInput.value.trim(),
            city: cityInput.value.trim(),
            supermarket: supermarketSelect.value.trim(),
        };

        try {
            const response = await fetch("/profile/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (response.ok) {
                showMessage(successMessage, "הפרטים עודכנו בהצלחה");
            } else {
                showMessage(errorMessage, result.error || "שגיאה בעדכון הפרטים");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            showMessage(errorMessage, "שגיאה בעדכון הפרטים. נסה שוב.");
        }
    });

    // Handle profile deletion
    deleteButton.addEventListener("click", async () => {
        try {
            const response = await fetch("/profile/delete", { method: "POST" });
            const result = await response.json();

            if (response.ok) {
                showMessage(successMessage, "המשתמש נמחק בהצלחה");
                setTimeout(() => {
                    window.location.href = "/";
                }, 2000); // Redirect after 2 seconds
            } else {
                showMessage(errorMessage, result.error || "שגיאה במחיקת המשתמש");
            }
        } catch (error) {
            console.error("Error deleting profile:", error);
            showMessage(errorMessage, "שגיאה במחיקת המשתמש. נסה שוב.");
        }
    });

    // Clear validation messages on input changes
    [phoneInput, nameInput, passwordInput, numberInput, streetInput, cityInput, supermarketSelect].forEach((input) => {
        input.addEventListener("input", () => input.setCustomValidity(""));
    });
});
