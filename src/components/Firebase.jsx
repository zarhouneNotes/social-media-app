// Import the functions you need from the SDKs you need
import {createUserWithEmailAndPassword, FacebookAuthProvider, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth'
import { useEffect } from "react";
import { useState } from "react";
import {initializeApp} from "firebase/app"
import {getFirestore } from  'firebase/firestore'
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
//     *********************************************
//     *********************************************
//     *********************************************
//     *********************************************
//     *********************************************
//     *********************************************
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
