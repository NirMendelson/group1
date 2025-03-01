# Grocery Delivery Sharing Platform

This website is designed to make shared grocery deliveries simple and efficient. Instead of ordering groceries alone, it allows users to share their delivery orders with nearby people, enabling everyone to split the delivery fee. Users can sign up, log in, and create delivery requests, which notify others nearby. The site includes thorough form validation, a responsive design for all devices, and a smooth loading animation for creating delivery offers.

## New Features

### 1. Data Base
In order to keep all information about users and deliveries made through our website we created a data base that contains 4 collections:
- Customers: every time a user wants to login to his profile through the login form the website accesses the customers' collection and searches for the user's details.
- Orders: all Orders are stored in the orders collection with all delivery and user's details.
- Supermarkets: contains the supermarket list.
- Notifications: stores all user notifications (a notification is sent when a nearby user schedules a delivery).
### 2. Session
Enables users to navigate through different pages on the website without having to log in each time.

### 3. Added Validations
- Delivery Date: Can only be chosen within the next 7 days (excluding today and Saturdays). If the selected date is a Friday, the latest delivery time allowed is 13:00.
- Order Cancellation: Can only be made at least 24 hours before the scheduled delivery date and time.
- Phone Number: Must start with `05` and only include digits.
- Multiple Deliveries: A user can create another delivery only after their previous delivery date has passed or if they cancel their delivery through their profile.

### 4. Profile Page
Once logged in, a user can access their profile page where he can:
- View all past and upcoming deliveries made through the website.
- Cancel upcoming delivery.
- Update their details.
- Delete theis profile.

### 5. Website flow
Home Page -> Sign in/Login -> Delivery -> Profile ->  Logout
-If a user tries to create a delivery before signing in or logging in, they will receive a message prompting them to log in first.
-Once logged in, the user will be able to access their profile page or log out.
