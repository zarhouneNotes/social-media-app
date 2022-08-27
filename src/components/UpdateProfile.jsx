import React, { useEffect, useState } from 'react'
import { db, useAuth } from './Firebase'
import {getDoc , doc  ,setDoc, updateDoc } from 'firebase/firestore'
import GetBio from './UpdateComponents/GetBio'
import GetFirstName from './UpdateComponents/GetFirstName'
import GetJob from './UpdateComponents/GetJob'
import GetLastName from './UpdateComponents/GetLastName'
import GetPhotoURL from './UpdateComponents/GetPhotoURL'
import GetUserName from './UpdateComponents/GetUserName'
import Map from './UpdateComponents/Map'
import {useNavigate} from 'react-router-dom'



function UpdateProfile() {
    const [status , setStatus] = useState(1)
    const [firstName , setFirstName] = useState('')
    const [lastName , setLastName] = useState('')
    const [username , setUsername] = useState('')
    const [bio , setBio] = useState('')
    const [job , setJob] = useState('')
    const [photoURL , setPhotoURL] = useState('')
    const [isCompleted , setIsCompleted] = useState(null)
    const currentUser = useAuth()
    const navigate= useNavigate()

   useEffect(() => {
     if (isCompleted === true) {
        // 
        console.log('profile completed')
     }
   }, [isCompleted])


   /////////////: const fetch user data
   useEffect(() => {
    if(currentUser){
      getDoc(doc(db , "users" , currentUser?.uid))
      .then((userInfo)=>{
      const response =  userInfo.data() 
      // console.log(response)
      setPhotoURL(response.pdp)
      setFirstName(response.firstName)
      setLastName(response.lastName)
      setUsername(response.username)
      setBio(response.bio)
      setJob(response.job)
      
      setIsCompleted(response.isProfileCompleted)
    })}
        
     
   }, [currentUser])



    const updateHandl =(e)=>{
        e.preventDefault()
      //  console.log('hu')



    
      updateDoc(doc(db , 'users', currentUser?.uid ),{
            bio : bio ,
            job : job ,
            firstName : firstName,
            isProfileCompleted :  true,
            lastName : lastName,
            pdp :  photoURL ,
            username : username 
            
          }
          
          )
          .then(()=>{
            navigate('/')
          })
          .catch(err=>console.log(err.message))
    }




  return (

    
        <div className="update-form">
            <Map status={status}   />
            <div className="quest">
                <h3 className='mb-4' >Complete your profile</h3>
                { status ===1 &&  <GetFirstName value={firstName}  setFirstName={setFirstName} setStatus={setStatus}    />  }
                { status ===2 &&   <GetLastName value={lastName}  setLastName={setLastName} setStatus={setStatus}   />}
                { status ===3 &&   <GetUserName value={username}  setUsername={setUsername} setStatus={setStatus}   />}
                { status ===4 &&   <GetBio      value={bio}       setBio={setBio}           setStatus={setStatus}   />}
                { status ===5 &&   <GetJob      value={job}       setJob={setJob}           setStatus={setStatus} />}
                { status ===6 &&   <GetPhotoURL value={photoURL}  setPhotoURL={setPhotoURL} setStatus={setStatus} updateHandl={updateHandl}  />}
            </div>
        </div>
  )
}

export default UpdateProfile