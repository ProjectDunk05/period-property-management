// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

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
const db = getFirestore(app);

let currentUser = null; // To store the authenticated user object

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in.
        currentUser = user;
        console.log('User is authenticated:', currentUser.uid);
    } else {
        // User is signed out or not authenticated.
        console.log('No user is authenticated. Redirecting to login.');
        alert('You need to be logged in to complete your profile.');
        window.location.href = "clientPortal.html"; // Redirect to your login page
    }
});

// Get the form element
const profileForm = document.getElementById('profile-form');

// Add event listener for form submission
if (profileForm) {
    profileForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default form submission behavior (page reload)

        if (!currentUser) {
            alert('No authenticated user found. Please log in again.');
            window.location.href = "clientPortal.html";
            return;
        }

        // Get values from form inputs
        const name = document.getElementById('name').value.trim();
        const postCode = document.getElementById('postCode').value.trim(); 
        const address = document.getElementById('address').value.trim();

        // Basic validation
        if (!name || !postCode || !address) {
            alert('Please fill in all required fields.');
            return;
        }

        try {
            // Create a document reference for the user's profile using their UID
            const userProfileRef = doc(db, 'userProfiles', currentUser.uid);

            // Set the document data (creates the document if it doesn't exist)
            await setDoc(userProfileRef, {
                fullName: name,
                postCode: postCode,
                address: address,
                email: currentUser.email, // Optionally store email too
                createdAt: new Date().toISOString() // Timestamp for when the profile was completed
            });

            console.log("User profile saved successfully for:", currentUser.uid);
            alert("Profile completed successfully! Redirecting to dashboard.");

            // Redirect to the main application dashboard
            window.location.href = "portalDashboard.html";

        } catch (error) {
            console.error("Error saving user profile:", error);
            alert(`Failed to save profile: ${error.message}. Please try again.`);
            // You might want to log out the user or offer to try again
        }
    });
} else {
    console.error("Profile form with ID 'profile-form' not found.");
}