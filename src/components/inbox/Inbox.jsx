import { collection, getDocs  ,onSnapshot, orderBy, query, where} from 'firebase/firestore'
import React,{useEffect, useState} from 'react'
import { RiH3 } from 'react-icons/ri'
import {Route , Routes, useLocation} from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import { db, useAuth } from '../Firebase'
import Friends from '../profiles/Friends'
import User from '../profiles/User'
import ChatFeed from './ChatFeed'
import Chats from './Chats' 
import DmListItem from './DmListItem'
import NoChat from './NoChat'

function Inbox({}) {
  const currentUser = useAuth()
  const [chats , setChats] = useState([])
  const  [chatsLoad , setChatsLoad] = useState(null)
  const [users , setUsers] = useState([])

  useEffect(() => {
      if (currentUser) {
          onSnapshot(
              query(
                  collection(db , 'users') , 
                  where("id", "!=", currentUser.uid)
                  ) , (snapshot ) =>{
                      const Data = []
                          snapshot.forEach((doc)=>{
                              Data.push(doc.data())
                          })
                          setUsers(Data)
                  } )
      }
     },[currentUser])

    // const  [bdg , setBDG] = useState(0)
    var bdg = 0 ;
   useEffect(()=>{
    const convs =[]
    if (currentUser) {
      setChatsLoad(true)
      getDocs(query(collection(db , 'chats'), where('users' , 'array-contains' ,currentUser.uid ) , orderBy('creditAt' , "desc") ))
      .then((res)=>{
        res.docs.forEach((doc)=>{
            convs.push(doc.data())
          
        })
        setChats(convs)
        setChatsLoad(false)
        // console.log(bdg)
      
      })
    }
   },[currentUser]) 
 

   const chatsComponents = chats?.map((chat)=>{
                // chat?.lastMessage?.viewers?.length !== 2 && chat?.lastMessage?.sender !== currentUser?.uid  ? bdg = bdg+1  :bdg = bdg ;
                return chat?.messages?.length !==0 && <DmListItem       key={chat?.id} chat={chat} />
              })
  //  useEffect(() => {
  //    if(chats){
  //     setBadge(bdg)
  //    }
  //  }, [chats])

  return (
    <div className='bg-dar inbox '  >
          <div className="convs col-lg-4 col-sm-12 bg-succes ">
          
                <h4 className="my-3 chats-label ">Chats</h4>
                <div className="conv-container ">
                { chatsLoad ? <div className='text-center' >  <ClipLoader color="#2a84ce"  /> </div>    :
                  chatsComponents
                    
                  }
                </div>
          </div>
          {/* <Chats>
            
          </Chats> */}
         <Routes>
         <Route path='/'  element={ <NoChat />}  />
          <Route path='/:id'  element={<ChatFeed  />}  />
         </Routes> 

        <div className="inbox-friends col-lg-2 px-2 " >
        <div className='m bg- d-flex ' style={{flexDirection:'column' , alignItems:'' , height:'87vh' , overflowY:'scroll'}} >
           <h4 className="my-3 px-2 " >Active</h4>
                { chatsLoad ? <div className='text-center' >  <ClipLoader color="#2a84ce"  /> </div>    :
                  users?.map((user)=>{
                            return user.isOnline && <User key={user.id} details={user} inInbox={true} />
                } )
                    
                }
              
            </div>
        </div>
    </div>
  )
  
}



export default Inbox