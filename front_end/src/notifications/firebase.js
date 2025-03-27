 // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGt4shuxsqKRM1SFQ8itVgqIodtk8-Gtg",
  authDomain: "judo-notifications-30f8e.firebaseapp.com",
  projectId: "judo-notifications-30f8e",
  storageBucket: "judo-notifications-30f8e.firebasestorage.app",
  messagingSenderId: "671051249001",
  appId: "1:671051249001:web:93948c54f9bfe7674a39f8",
  measurementId: "G-F2B42TXQPE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = getMessaging(app);

export const generateToken = async () => {
    const permission = await Notification.requestPermission();
    console.log(permission);
    if(permission === "granted") {
        const token = await getToken(messaging, {
            vapidKey:
            "BN4R8LNQSgQFdVLHCr2JlmUWxTMckO6HeJYkND1fuZydDglWmKuSv9CtSe7Ji5nEhzV_4DIiQbxtyrDfiljhWBQ",
        });
        console.log(token);
    }
};