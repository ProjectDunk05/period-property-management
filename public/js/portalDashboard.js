// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getFirestore, doc, getDoc, collectionGroup, query, where, getDocs } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

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

// Get references to DOM elements
const welcomeMessageElement = document.getElementById('welcomeMessage');
const dashboardLoadingMessageElement = document.getElementById('dashboardLoadingMessage');
const dashboardContentElement = document.getElementById('dashboardContent');
const userFilesListElement = document.getElementById('userFiles');
const noFilesMessageElement = document.getElementById('noFilesMessage');
const returnToSiteButton = document.getElementById('returnToSiteButton');

// Function to handle logging out
async function handleSignOut() {
    try {
        await signOut(auth);
        console.log('User signed out.');
        // Redirect to your public home page after logout
        window.location.href = "index.html"; 
    } catch (error) {
        console.error("Error signing out:", error);
        alert('Failed to sign out. Please try again.');
    }
}

// Attach event listener to "Return to Site" button
if (returnToSiteButton) {
    returnToSiteButton.addEventListener('click', function(event) {
        event.preventDefault(); 
        handleSignOut();
    });
}

// Function to load and display user-specific files
async function loadUserFiles(userId) {
    userFilesListElement.innerHTML = ''; // Clear previous list
    noFilesMessageElement.classList.add('hidden'); // Hide no files message initially

    try {
        // Firestore Collection Group Query to search all 'documents' subcollections
        const q = query(collectionGroup(db, 'documents'), where('allowedUsers', 'array-contains', userId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            noFilesMessageElement.classList.remove('hidden'); // Show no files message
        } else {
            querySnapshot.forEach((docSnap) => {
                const data = docSnap.data();
                const listItem = document.createElement('li');
                //Display file title and download url
                listItem.innerHTML = `
                    <strong>${data.title || 'Untitled Document'}</strong>
                    ${data.url ? `<a href="${data.url}" target="_blank">View Document</a>` : '<p>No direct link available</p>'}
                `;
                userFilesListElement.appendChild(listItem);
            });
        }
        console.log("User files loaded.");

    } catch (error) {
        console.error("Error loading user files:", error);
        userFilesListElement.innerHTML = '<li>Error loading your files. Please try again.</li>';
        noFilesMessageElement.classList.remove('hidden'); // Show error instead of "no files"
    }
}


// Main authentication state listener
onAuthStateChanged(auth, async (user) => {
    // Show loading message initially
    dashboardLoadingMessageElement.classList.remove('hidden');
    dashboardContentElement.classList.add('hidden');
    welcomeMessageElement.textContent = "Loading..."; // Default welcome message while loading

    if (user) {
        // User is signed in. Now check if their profile is complete.
        console.log('User authenticated:', user.uid);

        const userProfileRef = doc(db, 'userProfiles', user.uid);

        try {
            const docSnap = await getDoc(userProfileRef);

            if (!docSnap.exists() || !docSnap.data().fullName) {
                // Profile document DOES NOT exist or is missing fullName - profile is incomplete!
                console.log('Profile for user', user.uid, 'is incomplete. Redirecting to profile completion form.');
                alert("Your profile is incomplete. Please complete it to access the dashboard.");
                window.location.href = "profileCompletion.html"; // Redirect to profile completion
                return; 
            } else {
                // Profile document EXISTS and is complete!
                const profileData = docSnap.data();
                console.log('Profile for user', user.uid, 'is complete.', profileData);

                // Welcome user with their fullName
                welcomeMessageElement.textContent = `Welcome, ${profileData.fullName}!`;

                // Hide loading message and show dashboard content
                dashboardLoadingMessageElement.classList.add('hidden');
                dashboardContentElement.classList.remove('hidden');

                // Load and display user's authorized files
                await loadUserFiles(user.uid);

                // Any other dashboard-specific functions you might add later
            }
        } catch (error) {
            console.error('Error during profile check or file loading:', error.message);
            alert('An error occurred while loading your dashboard. Please try again or contact support.');
            // Critical error, sign out user
            await signOut(auth);
            window.location.href = "clientPortal.html"; // Redirect to login
        }

    } else {
        // No user is signed in. Redirect to the login page.
        console.log('No user authenticated. Redirecting to login page.');
        alert('You need to be signed in to access the dashboard.');
        window.location.href = "clientPortal.html"; // Or your specific login page path
    }
});