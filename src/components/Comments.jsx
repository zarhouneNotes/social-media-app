import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import React, { useEffect, useRef, useState } from 'react'
import { Form } from 'react-bootstrap'
import { db, useAuth } from './Firebase'
import {IoIosSend } from 'react-icons/io'
import {GrClose} from 'react-icons/gr'
import Comment from './Comment'
import uuid from 'react-uuid'
import Reply from './Reply'


function Comments({postId ,data , setOpenComments}) {
    const currentUser = useAuth()
    const [me , setMe] = useState()
    const [comments , setComments] = useState([])
    const [formValue , setFormValue] = useState('')
    const [showComForm , setShowComForm] = useState(true)    
    const comsRef = useRef() 
    useEffect(() => {
     if(currentUser){
        getDoc(doc(db ,'users' , currentUser?.uid))
        .then((res)=>{
          setMe(res.data())
        })
     }
    }, [currentUser])
    const notifStructure = {
        id  : uuid(),
        doer : currentUser?.uid ,
        target : postId ,
        new : 'commented on your post' ,
        isSeen : false ,
        type :'comment' ,
        time : new Date()

    }
    const repStructure = {
        id  : uuid(),
        doer : currentUser?.uid ,
        target : postId ,
        new : 'replied to your comment' ,
        isSeen : false ,
        type :'comment' ,
        time : new Date()

    }

    const commentStructure = {
        text : formValue ,
        author : currentUser?.uid ,
        authorDet : me,
        time : new Date(),
        replies:[],
        id : uuid()
    }
 
    useEffect(() => {
        let isSub = true
      if (currentUser) {
     
            onSnapshot(doc(db , 'posts' , postId), (res)=>{
              if(isSub) {setComments(res.data().comments)} 
            })
        
      }
      return ()=>{
         isSub = false
      }
    }, [currentUser])


    const filterComments = (oldArr , newValue)=>{

        const arr = []
        oldArr.map((item)=>{
            
                if(item.id == 2){
                    arr.push(newValue)
                }else{
                    arr.push(item)
                }
            
        })
        return arr

    }

    const repyHandel = (obj , comAuther)=>{
        const arr = comAuther?.notification
        const postAuthorNotifs = data?.notification
        arr.push(repStructure)
        postAuthorNotifs?.push(notifStructure)

        /////////
        updateDoc(doc(db, 'posts' , postId),
        {comments : filterComments(comments , obj)}
   )
   /////////////
        updateDoc(doc(db , 'users' , comAuther?.id),{
            notification : arr
        })
        updateDoc(doc(db , 'users' , data?.id),{
            notification : arr
        })
        
     
        
    }

    const commentHandel  = (e)=>{
        e.preventDefault()
        const notifs = data?.notification
        const arr = comments
        
        
        if(formValue){
           
            arr.push(commentStructure)
            setFormValue('')
            updateDoc(doc(db, 'posts' , postId),
                {comments : arr}
            )
            if(data?.id !== currentUser?.uid )  {
                notifs?.push(notifStructure)
                updateDoc(doc(db, 'users' , data?.id),
                {notification : notifs}
            )
             }
 
           
            
        }
        


    }
  return (
    <div className=' h-100 border-tp'>
        <div className='py-3 px-3 border-bottom d-flex'  style={{justifyContent:'space-between'}} >
            <h6>Comments</h6>
           <div className='text-secondary' onClick={()=>{setOpenComments(false)}}> 
            <GrClose  />
           </div>
        </div>

        <div className="comments-section bg-dar h-100 d-flex " style={{flexDirection:'column', justifyContent:'space-between' }}>
            <div className="comments-container  h-100 g-info "   >

                {comments?.map((com)=>{

                    
                    return  <Comment me={me} key={uuid()} repdetails={true} reps={com?.replies} showComForm={showComForm}  setShowComForm={setShowComForm}  repyHandel={repyHandel} com={com} /> 
                })}
                
                <div style={{height:'34vh'}} ref={comsRef} />
                    
            </div>
        
           {<Form 
                        onSubmit={commentHandel}
                        className="com-form text-center text-secondary bg-daner w-10 p-3 d-flex " 
                        style={{marginBottom:'2cm'}} >
                    <Form.Control
                        onFocus={()=>{comsRef?.current?.scrollIntoView()}} 
                        value={formValue} 
                        className='rounded-pill border-0 py-2 bg-light w-100 text-field' 
                        placeholder='write a comment..' 
                        type='text' 
                        onChange={(e)=>{setFormValue(e.target.value)}}
                     />

                        <button 
                            style={{background:'transparent' , border:'none'}}>
                            <IoIosSend size="30px" className='my-auto bg- mx-2 '
                        /> 
                        </button>
            </Form>}
        </div>
       

       
    </div>
  )
}
 
export default Comments