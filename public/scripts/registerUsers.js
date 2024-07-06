document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");

    const registerUser = async (event) => {
        event.preventDefault();

        const usernameInput = document.getElementById("usernameInput").value;
        const emailInput = document.getElementById("emailInput").value;
        const passwordInput = document.getElementById("passwordInput").value;

        const userData = {
            username: usernameInput,
            email: emailInput,
            password: passwordInput,
        };

        try {
            // Create user with userData
            const response = await fetch("http://localhost:3000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error("Failed to create user: ", error);
            }

            const result = await response.json();
            console.log("User created successfully:", result);
            alert("Account creation Successful!");
            
            // Redirect to login page after successful registration
            window.location.href = "index.html";
        } catch (error) {
            console.error("Error creating user:", error);
            alert("Account creation failed" );
        }
    };

    registerForm.addEventListener("submit", registerUser);
});
