import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect  , useState } from 'react'
import Fedd from './Fedd'
import { db, useAuth } from '../Firebase'
import MyPosts from './MyPosts'
import WhatIsInYourMind from './WhatIsInYourMind'
import Friends from './Friends'
import {useMediaQuery} from 'usehooks-ts'
import AllFriends from '../AllFriends'


function HomeStructure() {
    const isMobile = useMediaQuery('(max-width: 800px)')
    const currentUser = useAuth()
    const [photoUrl, setPhotoUrl] = useState('')
    const [username , setUsername] = useState('')
    const [load , setLoad] = useState(false)

    useEffect(()=>{
        if (currentUser) {
            setLoad(true)
            getDoc(doc(db , 'users'  , currentUser.uid))
            .then((res)=>{
                // console.log(res.data())
                setPhotoUrl(res.data().pdp)
                setUsername(res.data().username)
                setLoad(false)
            })
        }
    },[currentUser])



  return (
    <div  className='home-structure bg-sucess '  style={{minHeight:'100vh'}} >
        <div className={`feed  mt-3  ${isMobile ? "d-none" : "col-3"} `}  >Whaerver</div>
        <div className={`feed  mt-3  ${isMobile ? "col-12" : "col-6"} `}  >
            <WhatIsInYourMind load={load} url={photoUrl} username={username} />             
            <Fedd />
            
        </div>
      { !isMobile && <Friends   />}
       {/* <AllFriends/> */}
    </div>
  )
}

export default HomeStructure