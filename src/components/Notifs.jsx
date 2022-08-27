import { doc, updateDoc } from 'firebase/firestore'
import React from 'react'
import { GrClose } from 'react-icons/gr'
import { db, useAuth } from './Firebase'
import Notif from './Notif'

function Notifs({openNotif , setOpenNotif , notifs}) {
  const currentUser = useAuth()
  const readHandel = (e)=>{
    const arr = []
    e.preventDefault()
    notifs?.map((notif)=>{
      arr.push({...notif , isSeen : true})
    })
    updateDoc(doc(db , 'users',currentUser?.uid ),{
      notification : arr
    })

  }

  const readNotifHandel = (notif)=>{
    const arr = []
    notifs?.map((n)=>{
      if (n.id == notif.id) {
        arr.push({...n , isSeen : true})
      }else{
        arr.push(n)
      }
    })

    updateDoc(doc(db , 'users',currentUser?.uid ),{
      notification : arr
    })
    
  }

  const arr = notifs?.sort(function(a, b) {
    var keyA = new Date(a.time.seconds*1000),
      keyB = new Date(b.time.seconds*1000);
    // Compare the 2 dates
    if (keyA > keyB) return -1;
    if (keyA < keyB) return 1;         
    return 0;
  });
  
  // console.log(arr);



  return (
    <div className={` notifs ${openNotif ?'open-notifs' : ''} `} >
         <div className='py-3 px-3 border-bottom d-flex'  style={{justifyContent:'space-between'}} >
            <h6>Notifications</h6>
           <div className='text-secondary'> 
           <small 
           className='text-secondary mx-3 ' 
           style={{cursor : 'pointer'}} 
           onClick={readHandel}

            >
              <u>read all</u></small>
            <GrClose  style={{cursor : 'pointer'}}   onClick={()=>{setOpenNotif(false)}} />
           </div>
        </div>
        <div className='notifs-con '  style={{overflowY:'scroll'}}  >
          {notifs?.map((notif)=>{
            return notif?.doer !== currentUser?.uid && <Notif readNotifHandel={readNotifHandel} notif={notif} setOpenNotif={setOpenNotif} />
          })}
    
        </div>
    </div>
  )
}

export default Notifs