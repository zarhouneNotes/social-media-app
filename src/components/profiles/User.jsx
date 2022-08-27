import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'
import {useMediaQuery} from 'usehooks-ts'
import {Link  , useNavigate } from 'react-router-dom'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db, useAuth } from '../Firebase'

function User({details , setShow,tel , inInbox}) {
    const {pdp , firstName , lastName , isOnline , id , lastSeen } = details
    const currentUser = useAuth()
    const isMobile = useMediaQuery('(max-width: 800px)')
    const [checkChat , setCheckChat] = useState(null)
    const ls = new Date(lastSeen?.seconds*1000)
    const mth = ls.getMonth()
    const day = ls.getDate()
    
    const getConvId = (id1 , id2) =>{
        var convId ; 
            if (id1>id2) {
                convId = id1+id2
            }else{
                convId = id2+id1
            }
            return convId ;
    }  
    // console.log(details)
useEffect(() => {
  if (currentUser) {
       getDoc(doc(db , 'chats' , getConvId(id , currentUser?.uid)))
      .then((res)=>{
         if(!res.data()){
                  setDoc(doc(db , 'chats' , getConvId(id , currentUser?.uid)),{
                      messages : [] ,
                      creditAt :new Date() ,
                      lastMessage : {text : 'SAY HAY'} ,
                      id : getConvId(currentUser?.uid , id) ,
                      users:[currentUser.uid , id]

                  })
                  .then((res)=>{
                    console.log('dondon')
                 })
         }
      })
    //   
  }
}, [currentUser])


function isLessThanTen(t) {
    if (t<10) {
        return "0"+t
    }else{
        return t
    }
}



 
  return (
    <Link  to={`/inbox/${details.id}`} state={{data : {data : details   } }} style={{textDecoration : 'none' , color:'black'}}  >
        <div  onClick={()=>{setShow(false) ; }} className="users-user  w-1 d-flex   mb-1 py-2 px-2"   >
            <div className='d-flex mb- my-aut bg-ino '  >
                <div className="avatar-friend bg-dange rounded-circle  " style={{backgroundImage :`url(${pdp})`}}>
                   { isOnline &&  <div className="green-dot bg-"></div>}
                </div>
               { !tel && <small className=' user-flname my-auto mx-1 fw-bld' >{firstName} {lastName}</small>}
            </div>
            { !inInbox && !tel && !isOnline && <Form.Text className='bg-inf my-auto fs-' ><small> { day!==  new Date().getDate() ? isLessThanTen(day)+"/"+isLessThanTen(mth) : 'today' }  {isLessThanTen(ls.getHours())+':'+ isLessThanTen(ls.getMinutes()) }</small></Form.Text >}
            {/* {isOnline && <small className='text-success'>online</small>} */}
       </div>
   </Link>
    )
}

export default User











