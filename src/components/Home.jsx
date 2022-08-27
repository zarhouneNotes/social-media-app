import React, { useEffect, useState } from 'react'
import {useAuth , Logout, db } from './Firebase'
import {Alert, Badge, Button} from 'react-bootstrap'
import {useNavigate , Link , Routes , Route} from 'react-router-dom'
import { doc, getDoc,  onSnapshot,  updateDoc } from 'firebase/firestore'
import Navbar from './Navbar'
import UpdateProfile from './UpdateProfile'
import MyProfile from './profiles/MyProfile'
import HomeStructure from './profiles/HomeStructure'
import Inbox from './inbox/Inbox'
import OtherWall from './profiles/OtherWall'
import { collection , orderBy, query, where} from 'firebase/firestore'
import HomeLoading from './HomeLoading'


 

function Home() {
    
    const navigate = useNavigate()
    const [loading , setLoading] = useState(false)
    const[currentUserData , setCurrentUserData] = useState({})
    const [isProfileCompleted , setProfileCompleted] = useState(null)
    const  [chats , setChats] = useState([])
    const currentUser = useAuth()
     //////// if user not logged in redirect
 
 
 
  useEffect(() => {

    if (currentUser) {
      updateDoc(doc(db , 'users' , currentUser?.uid),{
        isOnline : true
      } )
    }
  

    
  }, [currentUser])
    
    useEffect(() => {
      setLoading(true)
   
      
        if (currentUser) {
          // console.log(currentUser)
       
           
             getDoc(doc(db , "users" , currentUser?.uid))
            .then((res)=>{
              // setProfileCompleted(res.data().isProfileCompleted) 
              setCurrentUserData(res.data())
              setLoading(false)
            })
         
          } 
    
        
       
    }, [currentUser])

    ////isProfileCompleted

    useEffect(() => {
      if (currentUserData) {
        // console.log(currentUserData)
       if (currentUserData?.isProfileCompleted === false) {
        navigate('/update-profile')
       }
    }
     }, [currentUserData])

///////log out
    const log_out = () =>{
        Logout()
        .then(()=>{
          updateDoc(doc(db , 'users', currentUser?.uid ),{
           isOnline : false,
           lastSeen : new Date()
          }
           
          )

          navigate('/login')
          localStorage.removeItem("auth")
          
        })
             
    }

    

    


  

    
   

  return loading ?   <HomeLoading />  :(  
    <div>
         

        <Navbar  
                
                firstname={currentUserData.firstName}
                lastname={currentUserData.lastName}
                khrj={log_out}
                url={currentUserData?.pdp}  
                username={currentUserData?.username}   />
        {/* <HomeStructure /> */}
        <Routes>
          <Route path='/' element={<HomeStructure />} />
          <Route path='/ref=:ref&opcom=:opcom' element={<HomeStructure />} />
          <Route path='/update-profile' element={<UpdateProfile />} />
          <Route path='/my-profile'  element={<MyProfile />}      />
          <Route path='/inbox/*' element={<Inbox  />}  />
          <Route path='/user=:id' element={<OtherWall />} />
          {/* <Route path='*' element={<h1 className='text-center py-5' >404!</h1>}  /> */}
        </Routes>
        
    </div>
  )
}

export default Home