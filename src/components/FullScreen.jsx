import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'

function FullScreen({setSeenPic , url}) {
  return (
    <div className='fullscreen'>
        <div className="close-full my-2" onClick={()=>{setSeenPic(false)}}>
             <AiOutlineClose fontSize="35px" className='text-light' />
            </div>
        <div className='d-flex'>
            
            {/* <img width='500px' src={url} alt="" srcset="" /> */}
            <div className='full-img bg-ligh' style={{backgroundImage:`url(${url})`}}  />
        </div>
        
    </div>
  )
}

export default FullScreen