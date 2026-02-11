// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD6T4srw_0zzEwe8dNmkKQFlMSs88zjb3Q",
    authDomain: "ppm-client-portal-dbd15.firebaseapp.com",
    projectId: "ppm-client-portal-dbd15",
    storageBucket: "ppm-client-portal-dbd15.firebasestorage.app",
    messagingSenderId: "169801543759",
    appId: "1:169801543759:web:7dda87639cea8ee43b3a3a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Email/Password Registration
const resetPassword = document.getElementById('submit');
resetPassword.addEventListener("click", async function (event) {
    event.preventDefault();

    //inputs
    const email = document.getElementById('email').value;

    // import firebase password reset function
    sendPasswordResetEmail(auth, email)
        .then(() => {
            // Password reset email sent!
            alert("Password reset email sent! Please check your inbox or spam folder."); // Add this line
            window.location.href = "portalSignIn.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error("Error sending password reset email:", errorCode, errorMessage);
            alert(`Error: ${errorMessage}`); // Provide error feedback to the user
        });
});