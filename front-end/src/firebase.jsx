import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC7YFiFEdnm7VR7wj6_Rc164na_e7jylK0",
  authDomain: "little-momo-0187.firebaseapp.com",
  projectId: "little-momo-0187",
  storageBucket: "little-momo-0187.appspot.com",
  messagingSenderId: "426323123768",
  appId: "1:426323123768:web:52524fea168b49bb1c90cd",
  measurementId: "G-VWNEV1CK5F"
};

const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);

