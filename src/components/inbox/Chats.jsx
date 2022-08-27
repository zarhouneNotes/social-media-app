import { collection, getDocs  ,onSnapshot, query, where} from 'firebase/firestore'
import React,{useEffect, useState} from 'react'
import { db, useAuth } from '../Firebase'
import DmListItem from './DmListItem'

function Chats({children}) {  
   const currentUser = useAuth()
  //  const [ chats, setChats] = useState([])           
  
// useEffect(()=>{
   

// },[currentUser])

  return   (
 
    <div className="convs col-3 bg-sucess">
      
            <h4 className="my-3">Chats</h4>
            <div className="conv-container  ">
              {children}
             
            </div>
  </div>
  )
}

export default Chats