import {  doc, getDoc, getDocs, onSnapshot, updateDoc } from 'firebase/firestore'
import React, { useState ,useEffect } from 'react'
import {Link , useParams } from 'react-router-dom'
import { db, useAuth } from '../Firebase'
import {MdOutlineReply} from 'react-icons/md'
import { DotLoader } from 'react-spinners'
import {useMediaQuery} from 'usehooks-ts'
import { Form } from 'react-bootstrap'

function DmListItem({chat , setBDG }) {
  const isMobile = useMediaQuery('(max-width: 800px)')
    const [load , setLoad] = useState(null)
    const [friend ,setFriend] = useState()   
    const [active ,setActive] = useState(null)
  
    const [conv , setConv] =useState()
     const [viewers , setViewers] = useState([])
    const currentUser = useAuth()
    const params = useParams()
    const PARAM_ID = Object.values(params)[0]
    const d =  new Date(conv?.creditAt?.seconds*1000)
    const mth = d.getMonth()+1
    const day = d.getDate()

    function isLessThanTen(t) {
      if (t<10) {
          return "0"+t
      }else{
          return t
      }
    }

  
    
    

    const getFriendId = ()=>{ 
    var friendId ;
      if (currentUser && chat) {
        friendId = chat?.users[0] == currentUser?.uid ? chat?.users[1] : chat?.users[0]   
        return friendId
      }
      return ;
    }    

    useEffect(() => {
      
      if (PARAM_ID == getFriendId()) {
       setActive(true)
      }
      else{
        setActive(false)
      }
      // return 
    }, [params])

       
    useEffect(()=>{
      if (chat && currentUser) {
          // setConv(chat)
        setLoad(true)
        getDoc(doc(db , 'users' , currentUser.uid ==  chat.users[1] ? chat.users[0] : chat.users[1] ))
        .then((res)=>{
          setFriend(res.data())
          setLoad(false)
        })
      }         
    },[chat, currentUser])


    useEffect(() => {
      if (chat) {

        onSnapshot(doc(db , 'chats' , chat.id) , (snapshot)=>{
          setConv(snapshot.data())
          setViewers(snapshot.data().lastMessage.viewers)  })
      }
    }, [chat])

    
    
    // function toTime(){
    //   if (conv) {
    //     let date = new Intl.DateTimeFormat('en-US', {hour12: false, hour: '2-digit', minute: '2-digit'}).format(d)
    //     return date
    //   }
    // return ;
    // }
    
  return load ? 
      <div className=" d-flex w-100 " style={{justifyContent:'center' , alignItems:'center'}} >
      <DotLoader
          color="#2a84ce"
          speedMultiplier={2}
          />  
      </div> 
      : (
    <Link  to={`/inbox/${getFriendId()}`} state={{data : {data : friend , chat : conv} }}  style={{color:'black' , textDecoration : 'none '}} >
      
    <div className={ active ? 'conv-item d-flex bg-ifo   border-info  bg-light text-liht  border' : 'conv-item d-flex bg-inf  '  } style={{alignItems:'center'  }} 
    // onClick={()=>{console.log(conv)}}
    >
        <div className="conv-img"  >
          <div className="chat-av" style={{backgroundImage:`url(${friend?.pdp})`}} ></div>
            {isMobile && !viewers?.includes(currentUser?.uid) && viewers?.length == 1 && <div className='red-dot-movile bg-' ></div> }
            { friend?.isOnline &&  <div className="activdot"></div>}
        </div>
        { !isMobile &&  <div className="conv-body bg-priary w-100 d-flex  "  style={{ flexDirection:'column' , justifyContent:'space-around' }} >
              <div className="conv-header bg-dangr w-100 px-2 my-1 d-flex" style={{alignItems:'center' , justifyContent : 'space-between'}}    > 
                  <h6>  {friend?.firstName} {friend?.lastName}   </h6>
                {!viewers?.includes(currentUser?.uid) && viewers?.length == 1 &&  <div className='red-dot bg-warnng text-daner rounded-circle '/>}
              </div>
              <div className="cover-footer bg-warnig w-100 px-2 d-flex" style={{alignItems:'center' , justifyContent : 'space-between'}}    >
                  <h6 className="text-secondary my-auto dcut-text ">   
                    <small className=' bg-dager' > 
                    {conv?.lastMessage?.sender == currentUser?.uid && <MdOutlineReply   />     }  
                    { !viewers?.includes(currentUser?.uid) && viewers?.length == 1 && <small className="text-dark fw-bold">NEW MESSAGE </small> }
                    {   viewers?.includes(currentUser?.uid) && viewers?.includes(friend?.id)| conv?.lastMessage?.sender == currentUser?.uid  && conv?.lastMessage.text  }
                    </small>
                  </h6>
                 { d &&  <Form.Text  ><small>{ day!==  new Date().getDate() ? isLessThanTen(day)+"/"+isLessThanTen(mth) : 'at' }  {isLessThanTen(d.getHours())+':'+ isLessThanTen(d.getMinutes()) }</small></Form.Text >}
              </div>  
              
        </div>}
        
    </div>   
   
    </Link>
  )
}

export default DmListItem