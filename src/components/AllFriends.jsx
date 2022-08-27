import { doc, updateDoc } from 'firebase/firestore'
import React from 'react'
import { Form } from 'react-bootstrap'
import { MdOutlineClose } from 'react-icons/md'
import { db } from './Firebase'
import User from './profiles/User'

function AllFriends({friends , show , setShow}) {
    
  return (
    // 
    <div className={`bg-dangr p-3 allfriends ${show ? "slide-friends" : ""} `}>
        <div className={`alllist-header py-3 d-flex bg-dager `} style={{justifyContent : 'space-between'}} >
                <h5 className='my-auto'>Contacts</h5>
                {/* <Form.Control type='text' placeholder='look for a friend..' size="sm" className='mx-1 rounded-pill' /> */}
                <MdOutlineClose className='my-auto mx-2  fs-3' onClick={()=>{setShow(false)}}   />

               
            </div>
              {/* <hr /> */}
       <div className="allfriends-container d-flex">
       {
                friends?.map((friend)=>{
                  // updateDoc(doc(db , 'users' , friend.id),{
                  //   displayName : friend.firstName+' '+friend.lastName
                  // })
                    return <User setShow={setShow} details={friend} key={friend.id} />
                })
        } 
      
       
       </div>
    </div>
  )
}

export default AllFriends