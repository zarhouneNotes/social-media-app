import { doc, onSnapshot } from 'firebase/firestore'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from './Firebase'
import {FaComments , FaUserFriends , FaComment} from 'react-icons/fa'
import {BsCheck2All} from 'react-icons/bs'
import {AiFillLike} from 'react-icons/ai'
function Notif({notif,readNotifHandel , setOpenNotif}) {
    const [doer , setDoer] = useState()
    const d = new Date(notif?.time?.seconds*1000 )
    const mth = d.getMonth()+1
    const day = d.getDate()
    function isLessThanTen(t) {
      if (t<10) {
          return "0"+t
      }else{
          return t
      }
    }
    useEffect(()=>{
        if (notif) {
            onSnapshot(doc(db , 'users' , notif.doer),(res)=>{
                setDoer(res.data())
              })
        }
    },[notif])

    function getLink (){
        var link ;
       switch (notif?.type) {
        case 'follow':
            link = `/user=${notif?.target}`
            break;
        case 'like':
            link = `/ref=${notif?.target}&opcom=${false}`
            break;
        case 'comment' :
            link  = `/ref=${notif?.target}&opcom=${true}`
            break ;
       
        default:
            link =''
            break;
       }

       return link
        
    }
    
    const readNotif =(e)=>{
        e.preventDefault()
        readNotifHandel(notif)
    }
    const sz = "55px"

  return (
    <div onClick={readNotif} className={`notif bg- m-1 py-2 ${notif?.isSeen ? 'bg-light' : 'border'}`} >
        <Link to={getLink()} className='link text-dark'  state={{data : doer}}>
        <div className='d-flex mx-1 h-10' onClick={()=>{setOpenNotif(false)}} style={{alignItems:'center'}} >
            
            <div className='profile-img  bg-drk rounded-circe '  style={{backgroundImage:`url(${doer?.pdp})` , width:"55px" , height :"55px"}}  />
            <div className='my-auto mx-2 w-100 bg-succes h-10 d-flex' style={{flexDirection:'column' , justifyContent:'space-between' ,  height:"55px"}}  >
                <div className="bg-dangr d-flex" style={{justifyContent:'space-between'}}>
                    <small className='cut-text' >
                        {doer?.firstName+' '+doer?.lastName+' '+notif?.new} &nbsp;&nbsp; 
                    </small>
                    {
                    notif?.type =="like" ? <AiFillLike className='text-info'  />
                    :  notif?.type =='comment' ? <FaComments className='text-info'  />
                    : <FaUserFriends className='text-info'  /> }
                </div>
                
                <div className='d-flex bg-inf' style={{justifyContent:'space-between'}} >
                    <small className='text-secondary' >
                    { day!==  new Date().getDate() ? isLessThanTen(day)+"/"+isLessThanTen(mth) : 'today at' } , {isLessThanTen(d.getHours())+':'+ isLessThanTen(d.getMinutes()) }
                    </small>
                    <small className='text-secondary'  >
                     see more
                    </small>
                
                </div>
            </div>
            
        </div>
        
        </Link>
        {/* <span onClick={readNotif}> <u>read</u> <BsCheck2All />    </span> */}
       
    </div>
  )
}

export default Notif