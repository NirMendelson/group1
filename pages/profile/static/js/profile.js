document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("profile-form");
    const deleteButton = document.querySelector(".delete-btn");
  
    // Handle profile update
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const data = {
        password: document.getElementById("password").value,
        phone: document.getElementById("phone").value,
        name: document.getElementById("name").value,
        number: document.getElementById("number").value,
        street: document.getElementById("street").value,
        city: document.getElementById("city").value,
        supermarket: document.getElementById("supermarket").value,
      };
  
      try {
        const response = await fetch("/profile/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
  
        const result = await response.json();
        if (response.ok) {
          document.getElementById("success-message").textContent = result.success;
        } else {
          document.getElementById("error-message").textContent = result.error;
        }
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    });
  
    // Handle profile deletion
    deleteButton.addEventListener("click", async () => {
      if (!confirm("Are you sure you want to delete your account?")) return;
  
      try {
        const response = await fetch("/profile/delete", { method: "POST" });
        const result = await response.json();
  
        if (response.ok) {
          alert(result.success);
          window.location.href = "/";
        } else {
          alert(result.error);
        }
      } catch (error) {
        console.error("Error deleting profile:", error);
      }
    });
  });
  