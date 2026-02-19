// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
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


// Email/Password Sign-in
const emailPasswordSubmit = document.getElementById('submit');
emailPasswordSubmit.addEventListener("click", async function (event) {
  event.preventDefault();

  //inputs
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    alert("Attempting to sign in with email/password...");
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user) {
        console.log('User signed in successfully with email/password:', user.uid);
        // Call the helper function to check profile and redirect
        await checkAndRedirectForProfile(user);
    }
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(`Error: ${errorMessage}`);
    console.error('Email/Password Sign-in error:', errorCode, errorMessage);
  }
});


// Google Sign-in
const googleSignInButton = document.getElementById('signInWithGoogle'); 
if (googleSignInButton) {
  googleSignInButton.addEventListener("click", async function (event) {
    event.preventDefault();

    const provider = new GoogleAuthProvider(); // Create a new Google Auth Provider instance

    try {
      alert("Attempting to sign in with Google...");
      const result = await signInWithPopup(auth, provider); // Use signInWithPopup for a pop-up window
      const user = result.user; // The signed-in user info

      if (user) {
        console.log('User signed in successfully with Google:', user.uid);
        // Call the helper function to check profile and redirect
        await checkAndRedirectForProfile(user);
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // Handle specific errors, e.g., if the user closes the pop-up
      if (errorCode === 'auth/popup-closed-by-user') {
        alert("Google Sign-in popup closed. Please try again.");
      } else {
        alert(`Error: ${errorMessage}`);
      }
      console.error('Google Sign-in error:', errorCode, errorMessage);
    }
  });
} else {
  console.warn("No button with id 'signInWithGoogle' found. Google Sign-in functionality will not be active.");
}

