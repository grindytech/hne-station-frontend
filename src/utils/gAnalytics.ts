// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDeh2BGvqf2zEROHnCKuyAI643NXn2xMQ8",
  authDomain: "he-station.firebaseapp.com",
  projectId: "he-station",
  storageBucket: "he-station.appspot.com",
  messagingSenderId: "232509630657",
  appId: "1:232509630657:web:b5abf15d1348302e7d4c40",
  measurementId: "G-0Z164BTZP6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const init = () => analytics.app.name;
const gaEvent = (event: any) => {
  logEvent(analytics, event);
};
export { analytics, init, gaEvent };
