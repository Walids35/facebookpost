// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import{getStorage} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAXqX3TCSLGO2_ogaCvEIqQWdfUy0avsL8",
  authDomain: "postimagehandling.firebaseapp.com",
  projectId: "postimagehandling",
  storageBucket: "postimagehandling.appspot.com",
  messagingSenderId: "408354576400",
  appId: "1:408354576400:web:efa46d68d0d846b6bb1295"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)