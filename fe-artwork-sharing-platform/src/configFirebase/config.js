import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCF-ZKL_dpKydBtE7PFInELmpYw0mNZzfs",
  authDomain: "artwork-platform.firebaseapp.com",
  databaseURL: "https://artwork-platform-default-rtdb.firebaseio.com",
  projectId: "artwork-platform",
  storageBucket: "artwork-platform.appspot.com",
  messagingSenderId: "568416314765",
  appId: "1:568416314765:web:7d244b23ad83a8321fc9c4",
  measurementId: "G-Z1DTC6920L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const imgDb = getStorage(app);