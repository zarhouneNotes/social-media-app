import { doc, onSnapshot } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'
import { db } from './Firebase'

function Reply({rep, setShowReplyForm , showReplyForm, showComForm , setShowComForm}) {
  
    // const [author, setAuthor] = useState()
    const author = rep?.authorDet
    const d = new Date(rep?.time?.seconds*1000)
    const mth = d.getMonth()
    const day = d.getDate()
    // useEffect(() => {
    //   onSnapshot(doc(db , 'users' ,rep?.author),(res)=>{
    //     setAuthor(res.data())
    //   })
    // }, [rep])
    function isLessThanTen(t) {
        if (t<10) {
            return "0"+t
        }else{
            return t
        }
      }
  return (
    <div className="com bg-ino w-100 w-1 mx- my-2 bor d-flex " >
        <div className='' >
         <div className="profile-img my-auto rounded-circle" style={{backgroundImage:`url(${author?.pdp})` , width:'30px' , height:'30px' }} />
        </div>

        <div className='bg-dangr ' style={{width:'100%'}}  >
            <div className='bg-dangr w-100'>
                <div className='mx-2 bg-light px-3 py-2  w-10' style={{borderRadius:'1em' , zIndex: "999", }} >
                    <div className="d-flex" style={{alignItems:'center' ,justifyContent:'space-between' }} >
                        <small className='text-secondary ' >{author?.firstName+' '+author?.lastName}   
                    
                        </small>
                        <Form.Text className='my-auto' > 
                        { day!==  new Date().getDate() ? isLessThanTen(day)+"/"+isLessThanTen(mth) : ' at' } , {isLessThanTen(d.getHours())+':'+ isLessThanTen(d.getMinutes()) }
                        </Form.Text>
                </div>
            
                <div className='d-flex  bg-ino' style={{alignItems:'center' , justifyContent:'space-between'}}>
                    <div className=' bg-succsss w-75'>  {rep?.text}</div> 
                    <small 
                    onClick={()=>{setShowReplyForm(true) ;}}
                    className='text-secondary'
                    >reply</small>
                </div>
            </div>
            
            </div>

     
            
       </div>

    </div> 
  )
}

export default Reply