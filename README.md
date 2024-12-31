# Grocery Delivery Sharing Platform

This website is designed to make shared grocery deliveries simple and efficient. Instead of ordering groceries alone, it allows users to share their delivery orders with nearby people, enabling everyone to split the delivery fee. Users can sign up, log in, and create delivery requests, which notify others nearby. The site includes thorough form validation, a responsive design for all devices, and a smooth loading animation for creating delivery offers.

## Features

### 1. Registration Form Validation
The registration form ensures all details are correct:
- **Phone Number:** Must start with `0` and only include digits.
- **Email:** Must include `@` and a domain with a `.` (e.g., `.com`).
- **Password:** Needs to be at least 8 characters long, with at least one letter and one number.
- **Name, City, and Street:** Only Hebrew letters are allowed.
- **House Number:** Must include only numbers.
- **Supermarket Selection:** A preferred supermarket must be chosen.

### 2. Login Form Validation
- **Email:** Checks that the email includes `@` and a domain with a `.`.
- **Password:** Validates the same requirements as the registration form.

### 3. Delivery Form Validation
- **Supermarket Selection:** Requires a supermarket to be selected.
- **Date:** Only allows dates starting from tomorrow.
- **Time:** A valid time must be selected.

### 4. Responsive Design
The site is fully responsive, ensuring a seamless experience on desktops, tablets, and smartphones.

### 5. Loading Animation
After creating a delivery offer, users see a loading animation featuring:
- A spinning circle.
- Three changing messages, displayed every 2 seconds:
  1. "Data received"
  2. "Sending notifications to nearby users"
  3. "Delivery details sent, users who want to join will contact you"

This animation makes the process of creating a delivery offer more engaging and clear.
