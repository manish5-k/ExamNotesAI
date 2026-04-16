 
import { initializeApp } from "firebase/app";
import{getAuth, GoogleAuthProvider} from "firebase/auth"
 
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "authexamnotes-72ffa.firebaseapp.com",
  projectId: "authexamnotes-72ffa",
  storageBucket: "authexamnotes-72ffa.firebasestorage.app",
  messagingSenderId: "635936052094",
  appId: "1:635936052094:web:4fbbafe11046a27c2e992f"
};

 
const app = initializeApp(firebaseConfig);
const auth=getAuth(app)

const provider=new GoogleAuthProvider()
export{auth,provider}