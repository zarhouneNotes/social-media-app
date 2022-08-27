import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import React, { useEffect, useRef, useState } from 'react'
import { Form } from 'react-bootstrap'
import { IoIosSend } from 'react-icons/io'
import uuid from 'react-uuid'
import { db, useAuth } from './Firebase'
import {Link} from 'react-router-dom'
import {useMediaQuery}from'usehooks-ts'
import Reply from './Reply'

function Comment({com ,repdetails, repyHandel , reps , showComForm,me , setShowComForm}) {
    const isMobile = useMediaQuery('(max-width: 800px)')
    const replies = com?.replies
    const refForm = useRef()
    const repsEnd = useRef()
    const currentUser = useAuth()
    const author = com?.authorDet
    const [showReps , setShowReps] = useState(true)
    const [showReplyForm , setShowReplyForm] = useState(false)
    const [load , setLoad] = useState()

    const [replyForm , setReplyForm] = useState('')
    const d = new Date(com?.time?.seconds*1000)
    const mth = d.getMonth()+1
    const day = d.getDate()
    const replyStructure = {
        text : replyForm ,
        author : currentUser?.uid,
        authorDet: me,
        time : new Date(),
    }
    function isLessThanTen(t) {
      if (t<10) {
          return "0"+t
      }else{
          return t
      }
    }

    // useEffect(()=>{
        
    //     if (com) {
    //         setLoad(true)
    //         getDoc(doc(db , 'users' , com?.author))
    //         .then((res)=>{
    //             setAuthor(res.data())
    //             setLoad(false)
    //         })
    //     }
    // },[com])

    // useEffect(() => {
    //   if (showReplyForm) {
    //     refForm?.current?.scrollIntoView({behavior : "smooth" , block :'center'})
    //     repsEnd?.current?.scrollIntoView({behavior : "smooth" , block :'center'})
    //   }
    // }, [showReplyForm])


    function rep(e){
        e.preventDefault()
        const arr = replies
       
        if (replyForm) {
            arr?.push(replyStructure)
            repyHandel({...com , replies : arr} , author)
            setReplyForm('')
            // setShowReps(true)
            // setShowReplyForm(false)
            
        }
    }

  return load ? 
   ( <div className=' my-2  d-flex'>
        <div className="profile-img bg-light rounded-circle my-auto "  />
        <div className='w-50 bg-light rounded-pill mx-2 py-2' style={{height:'1.3cm'}}  />
    </div>)

  : (
   
    <div   className="com bg-ino py-1 w-1 mx-2 my-2 bor d-flex " >
        <Link  className='link text-secondary' to={`/user=${author?.id}`}  state={{data :author }} >
            <div className='' >
            <div className="profile-img my-auto rounded-circle" style={{backgroundImage:`url(${author?.pdp})` }} />
            </div>
        </Link>
        <div className='bg-dangr border-liht boder'  style={{ minWidth:isMobile ? '70%' : '40%'}} >
            <div className='bg-dangr w-100'>
                <div className='mx-2  bg-light px-3 py-2  w-10' style={{borderRadius:'1em' , zIndex: "999", }} >
                    <div className="d-flex py-" style={{alignItems:'center' ,justifyContent:'space-between' }} >
                        <small className='text-secondary ' >
                            <Link className='link text-secondary'  to={`/user=${author?.id}`} state={{data :author }} >{author?.firstName+' '+author?.lastName} </Link> 
                        </small>
                        <Form.Text className='my-auto' > 
                        { day!==  new Date().getDate() ? isLessThanTen(day)+"/"+isLessThanTen(mth) : ' at' } , {isLessThanTen(d.getHours())+':'+ isLessThanTen(d.getMinutes()) }
                        </Form.Text>
                    </div>
            
                <div className='d-flex pt-2x bg-ino' style={{alignItems:'center' , justifyContent:'space-between'}}>
                    <div className=' bg-succsss w-75'>  {com?.text}</div> 
                  { repdetails && <small 
                  
                    className='text-secondary'
                    >
                       {reps?.length !==0 && <span onClick={()=>{setShowReps(!showReps) ; setShowReplyForm(!showReps)}} >reps({reps?.length})</span> }
                        <span className='mx-1'   onClick={()=>{setShowReplyForm(true) ;}} >reply</span>

                        
                    </small>}
                </div>
            </div>
            <div className="px-mt-1 py-1 bg-dar replies" style={{maxHeight:'40vh' , overflowY:'scroll'}}>
                
            { showReps && reps?.map((reply)=>{
                            return <Reply showComForm={showComForm}  setShowComForm={setShowComForm} showReplyForm={showReplyForm}  setShowReplyForm={setShowReplyForm} rep={reply} />
                        })}
                        <div style={{height:'1vh'}}  ref={repsEnd}  />
            </div>
            </div>

           {showReplyForm &&   <Form 
           
            ref={refForm}
            onSubmit={rep}
            // style={{display:  ?'flex' : 'none'}}
            className=' mx-2 mt-1 d-flex mb-3 '>
            <Form.Control
                        onFocus={()=>{refForm?.current?.scrollIntoView({block : isMobile ? 'start' : 'center' , behavior : 'smooth'})}} 
                        value={replyForm} 
                        className='rounded border-0 py-2 bg-light  text-field' 
                        placeholder='write a reply..' 
                        type='text' 
                        onChange={(e)=>{setReplyForm(e.target.value)}}
                     />

                        <button 
                            className='text-secondary'
                            style={{background:'transparent' , border:'none'}}>
                            <IoIosSend size="30px" className='my-auto bg-  '
                        /> 
                        </button>
            </Form>
            }
       </div>

    </div> 




   
  )
}

export default Comment