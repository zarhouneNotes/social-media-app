import React from 'react'
import uuid from 'react-uuid'
import { useAuth } from '../Firebase'
import Mymsg from './Mymsg'
import OtherPartMsg from './OtherPartMsg'

function ConversationArea({messages , lastMessage}) {
    const currentUser = useAuth()
    function checkEquality(a , b ) {
        if (currentUser) { 
         return a == b
        }
     } 

   
    function toTime(timestamp){
        const d = new Intl.DateTimeFormat('en-US', {hour12: false, hour: '2-digit', minute: '2-digit'}).format(timestamp*1000)
        return d
    }
  return (
    <>{
        messages?.map((message)=>{   
          const at = ""
          // toTime(parseInt(message?.creditAt?.seconds))
            return  checkEquality(message?.sender , currentUser?.uid) ?
                      <Mymsg  lastMessage={lastMessage} at={at} message={message} key={uuid()} /> :
                       <OtherPartMsg at={at}  message={message} key={uuid()} />
                                                       
                  })
    }</>

  )
}

export default ConversationArea