import React, { useState } from 'react'
import { Form } from 'react-bootstrap'

import FullScreen from '../FullScreen';

function OtherPartMsg({message}) {
  const [showTime , setShowTime] = useState(false)

  const d= new Date(message?.creditAt?.seconds*1000)
  const mth = d.getMonth()+1
  const day = d.getDate()
function isLessThanTen(t) {
  if (t<10) {
      return "0"+t
  }else{
      return t
  }
}
 
const [openPic , setOpenPic] = useState(false)
  return (
    <div  onClick={()=>{setShowTime(!showTime)}}  className='d-flex my-1 msgcontainer '>
       {message?.text && 
       <div className=' othermsg py-2 px-3 text-inf bg-light '  >
        {message?.text}
        </div>}
        { message?.image && 
        <div className='bg-light p-2 rounded' style={{zIndex:"99"}}>
          <img 
           onClick={()=>{setOpenPic(true)}}
          className='rounded' src={message?.image}  width='300px'  alt="random photo" srcset="random photo" />
        </div>}
        <Form.Text className={`my-auto mx-2 othermsg-time ${showTime ? 'othermsg-time-slide' : ''}`}  ><small>{ day!==  new Date().getDate() ? isLessThanTen(day)+"/"+isLessThanTen(mth) : 'today' }  {isLessThanTen(d.getHours())+':'+ isLessThanTen(d.getMinutes()) } </small></Form.Text>
        { openPic &&  <FullScreen url={message?.image} setSeenPic={setOpenPic}  />}
 
    </div>
  )
}

export default OtherPartMsg