import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './components/Firebase'

const  PrivateRoute =  ({children}) =>{
    const auth = localStorage.getItem("auth")
 if (!auth) {
   return <Navigate  to='/login'  />
 }

// useEffect(()=>{
//   console.log(  auth) 
// },[])
  return <>{children}</> 
}

export default PrivateRoute