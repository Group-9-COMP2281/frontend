// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCBqWtrsFw88Ry8ky_bIoZ-gxLMNKBM124",
  authDomain: "engagement-dashboard-b5c83.firebaseapp.com",
  databaseURL: "https://engagement-dashboard-b5c83-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "engagement-dashboard-b5c83",
  storageBucket: "engagement-dashboard-b5c83.appspot.com",
  messagingSenderId: "141907108538",
  appId: "1:141907108538:web:2cc53ddaff66fe2c59d883",
  measurementId: "G-TRJWF5H8YM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;