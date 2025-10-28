// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
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
const auth = getAuth(app)



//submit button
const submit = document.getElementById('submit');
submit.addEventListener("click", function (event) {
  event.preventDefault()

  //inputs
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;


  //  confirm password match
  if (password !== confirmPassword) {
    alert("Passwords do not match. Please try again.");
    return; 
  }
  
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
      alert("creating account...")
      window.location.href ="account-created.html";
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage)
      // ..
    });

})