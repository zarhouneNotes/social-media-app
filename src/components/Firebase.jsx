// Import the functions you need from the SDKs you need
import {createUserWithEmailAndPassword, FacebookAuthProvider, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth'
import { useEffect } from "react";
import { useState } from "react";
import {initializeApp} from "firebase/app"
import {getFirestore } from  'firebase/firestore'
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
    // apiKey: "AIzaSyCZETOyrf0Zd952Mn7KcMjg6U-674Z0cpk",
    // authDomain: "chat-app-1ba65.firebaseapp.com",
    // projectId: "chat-app-1ba65",
    // storageBucket: "chat-app-1ba65.appspot.com",
    // messagingSenderId: "912688328487",
    // appId: "1:912688328487:web:e3e26495f6bcb68b6e4302",
    // measurementId: "G-XTX7EWNBQZ"

    apiKey: "AIzaSyAA8jlXqel8ndMt735khNNXTIYNobV2J3A",
  authDomain: "social-app-1491d.firebaseapp.com",
  databaseURL: "https://social-app-1491d-default-rtdb.firebaseio.com",
  projectId: "social-app-1491d",
  storageBucket: "social-app-1491d.appspot.com",
  messagingSenderId: "888676848362",
  appId: "1:888676848362:web:ff38d01e6efcb7eecd7d93"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig)
////storage
export const storage = getStorage(app)
/// data base
export  const db = getFirestore(app)

const auth = getAuth()

export const login = (email , password) =>{
    return signInWithEmailAndPassword(auth , email , password)
}

export const useAuth = ()=>{
    const [currentUser , setCurrentUser] = useState(null)
    useEffect(() => {
     const unsub = onAuthStateChanged(auth , (user)=>{setCurrentUser(user)})
     return unsub ;
    })
    return currentUser ;
}

export  function Logout() {
    return signOut(auth)
}

export function Sign_up (email , password){
    return createUserWithEmailAndPassword(auth , email , password)
}

export function LogInWithGoogle (){
    const GOOGLE_AUTH_PROVIDER = new GoogleAuthProvider()
    return signInWithPopup(auth , GOOGLE_AUTH_PROVIDER)
}

// export function LoginWithFacebook (){
//     const FB_AUTH_PROVIDER = new FacebookAuthProvider()
//     return signInWithPopup(auth , FB_AUTH_PROVIDER)
// }