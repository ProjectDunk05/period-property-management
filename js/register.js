// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js"; // Import Firestore functions

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
const db = getFirestore(app); // Initialize Firestore

// Helper function to handle profile check and redirection
async function checkAndRedirectForProfile(user) {
    const userProfileRef = doc(db, 'userProfiles', user.uid);

    try {
        const docSnap = await getDoc(userProfileRef);

        if (!docSnap.exists()) {
            // Profile document DOES NOT exist in Firestore
            console.log('Profile for user', user.uid, 'is incomplete. Redirecting to profile completion form.');
            alert("Account created! Please complete your profile.");
            window.location.href = "profileCompletion.html";
        } else {
            // Profile document EXISTS
            console.log('Profile for user', user.uid, 'is complete.', docSnap.data());
            alert("Account created and profile is complete. Welcome!");
            // User has a complete profile, allow them into the main app dashboard
            window.location.href = "portalDashboard.html";
        }
    } catch (error) {
        console.error('Error checking profile status:', error.message);
        alert('Account created, but an error occurred checking profile status. Please try logging in again.');
        // Optionally, sign out the user if there's a critical error
        auth.signOut();
        window.location.href = "portalSignIn.html"; // Redirect to login
    }
}


// Email/Password Registration
const emailPasswordSubmit = document.getElementById('submit'); 
emailPasswordSubmit.addEventListener("click", async function (event) {
  event.preventDefault();

  //inputs
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;


  // confirm password match
  if (password !== confirmPassword) {
    alert("Passwords do not match. Please try again.");
    return;
  }

  try {
    alert("creating account with email/password...");
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user) {
        console.log('User registered successfully with email/password:', user.uid);
        // Call the helper function to check profile and redirect
        await checkAndRedirectForProfile(user);
    }
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(`Error: ${errorMessage}`);
    console.error('Email/Password Registration error:', errorCode, errorMessage);
  }
});


// Google Registration/Sign-in
const googleRegisterButton = document.getElementById('registerWithGoogle'); // Assuming you have a button with id="registerWithGoogle"
if (googleRegisterButton) {
  googleRegisterButton.addEventListener("click", async function (event) {
    event.preventDefault();

    const provider = new GoogleAuthProvider(); // Create a new Google Auth Provider instance

    try {
      alert("Attempting to register/sign in with Google...");
      const result = await signInWithPopup(auth, provider); // Use signInWithPopup
      const user = result.user; // The signed-in/registered user info

      if (user) {
        console.log('User registered/signed in successfully with Google:', user.uid);
        // Call the helper function to check profile and redirect
        await checkAndRedirectForProfile(user);
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === 'auth/popup-closed-by-user') {
        alert("Google Sign-in popup closed. Please try again.");
      } else {
        alert(`Error: ${errorMessage}`);
      }
      console.error('Google Registration/Sign-in error:', errorCode, errorMessage);
    }
  });
} else {
  console.warn("No button with id 'registerWithGoogle' found. Google registration functionality will not be active.");
}
