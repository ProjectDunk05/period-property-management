// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";


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

// Helper function to handle profile check and redirection
async function checkAndRedirectForProfile(user) {
    const userProfileRef = doc(db, 'userProfiles', user.uid);

    try {
        const docSnap = await getDoc(userProfileRef);

        if (!docSnap.exists()) {
            // Profile document DOES NOT exist in Firestore
            console.log('Profile for user', user.uid, 'is incomplete. Redirecting to profile completion form.');
            alert("Signed in! Please complete your profile.");
            window.location.href = "profileCompletion.html"; // Redirect to your profile completion form
        } else {
            // Profile document EXISTS
            console.log('Profile for user', user.uid, 'is complete.', docSnap.data());
            alert("Signed in. Welcome!");
            window.location.href = "portalDashboard.html"; // Redirect to your main app dashboard
        }
    } catch (error) {
        console.error('Error checking profile status:', error.message);
        alert('Signed in, but an error occurred checking profile status. Please try logging in again.');
        auth.signOut();
        window.location.href = "clientPortal.html"; // Redirect to login page
    }
}


//submit button
const submit = document.getElementById('submit');
submit.addEventListener("click", async function (event) { 
  event.preventDefault();

  //inputs
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    alert("Attempting to sign in...");
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user) {
        console.log('User signed in successfully:', user.uid);
        // Call the helper function to check profile and redirect
        await checkAndRedirectForProfile(user);
    }
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(`Error: ${errorMessage}`);
    console.error('Sign-in error:', errorCode, errorMessage);
  }
});

