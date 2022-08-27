import React,{useState} from 'react'
import { Form } from 'react-bootstrap'
import { BiCheck , BiCheckDouble } from 'react-icons/bi'
import "react-circular-progressbar/dist/styles.css";
import { PuffLoader } from 'react-spinners';
import { useAuth } from '../Firebase';
import FullScreen from '../FullScreen';


function Mymsg({message , lastMessage  }) {
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
 const currentUser = useAuth()
 const [openPic , setOpenPic] = useState(false)
  return (
    <div onClick={()=>{setShowTime(!showTime) ; console.log(message?.image ) }} className="msgcontainer d-flex my-2 bg-daner " style={{justifyContent:'flex-end' , alignItems:'center'}}  >
    { message?.text!=="" && <Form.Text className={`my-auto mx-2 mymsg-time ${showTime ? 'mymsg-time-slide' : ''}`} > <small> { day!== new Date().getDate() ? isLessThanTen(day)+"/"+isLessThanTen(mth) : 'today' }   { isLessThanTen(d.getHours()) +':'+isLessThanTen(d.getMinutes())}</small> </Form.Text>}
          {!message?.image && message?.text!=="" && <div  className='my-auto msg-holder d-flex '  style={{  flexDirection:'column' , alignItems:'end' , justifyItems:'' }} >
              <div className={'mymsg  p-2  bg-info text-light  '  } >
              { message?.sender ==  currentUser?.uid && message?.viewers?.length ==2 
              ? <BiCheckDouble className='text-light'   /> :  <BiCheck className='text-light'   />  } 
                <span className="px-3">{message?.text}</span>
              </div>
            </div>}

          { message?.image &&  
            <div  className='my-auto msg-holder rounded bg-info p-1 d-flex '  style={{  flexDirection:'column' , alignItems:'end' , zIndex:"999" }} >
                    <img
                    onClick={()=>{setOpenPic(true)}}
                     className=' rounded '   width='300px'  src={message?.image}  alt="random photo" srcset="random photo"/>

{ message?.sender ==  currentUser?.uid && message?.viewers?.length ==2 
              ? <BiCheckDouble className='text-light'   /> :  <BiCheck className='text-light'   />  } 
                              { openPic &&  <FullScreen url={message?.image} setSeenPic={setOpenPic}  />}
                      
 
            </div>}
            { openPic &&  <FullScreen url={message?.image} setSeenPic={setOpenPic}  />}
 </div>  
  )
}
 
export default Mymsg