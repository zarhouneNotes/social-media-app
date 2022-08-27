import React, { useEffect, useState , useRef} from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import Mymsg from './Mymsg'
import OtherPartMsg from './OtherPartMsg'
import {IoIosSend} from 'react-icons/io'
import {HiPhotograph} from 'react-icons/hi'
import {BsKeyboard} from 'react-icons/bs'
import {FaTrashAlt} from 'react-icons/fa'
import {Link, useLocation , useParams  } from 'react-router-dom'
import { db, storage, useAuth } from '../Firebase'
import { collection, doc, getDoc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from 'firebase/firestore'
import uuid from 'react-uuid'
import { DotLoader, PuffLoader } from 'react-spinners'
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage'
import ConversationArea from './ConversationArea'

function ChatFeed({}) {
    const location = useLocation()
    const params = useParams()   
    const currentUser = useAuth()
    const myRef = useRef()
    //////

    const chatId = location?.state?.data?.chat?.id
    const [chekhConv , setCheckConv] = useState(location.state?.data?.haveWeTalked)
    const [messages , setMessages] = useState([]) 
    const [messageText , setMessageText ] = useState('')
    const [convLoad , setConvLoad] = useState(null)
    const [file , setFile] = useState(null)
    const [chat , setChat] = useState()
    const [badge , setBadge] = useState(false)
    const [picLoad , setPicLoad] = useState(null)
    const [friend , setFriend] = useState()
    const [friendId , setFriendId] = useState()

    const msgStructure = {
        sender : currentUser?.uid ,
        creditAt : new Date(),
        text : messageText ,
        viewers :[currentUser?.uid] , 
    }
    const getConvId = (id1 , id2) =>{
      var convId ; 
          if (id1>id2) {
              convId = id1+id2
          }else{
              convId = id2+id1 
          }
          return convId ;
  }  


  
    useEffect(()=>{
        if (messages) {
          myRef.current?.scrollIntoView(); 
        }

    },[messages])



    useEffect(() => {
      if (params) {
        onSnapshot(doc(db, 'users' ,params?.id),(snapshot)=>{
          setFriend(snapshot.data())
        })
      }
    }, [params])

    useEffect(()=>{
      setConvLoad(true)
      let isApiSubscribed = true;
      if (friend && currentUser) {
        
        // const frindID = conv?.users[0] == currentUser?.uid ?  conv?.users[1] : conv?.users[0]
        onSnapshot(query(doc(db , 'chats' ,  getConvId(friend.id , currentUser?.uid)  )), (doc)=>{
            
          if(isApiSubscribed){
            setChat(doc.data())
            setMessages(doc.data().messages)
            setConvLoad(false)
          }

          
          
      }   )     
      }
      return () => {
        // cancel the subscription
        isApiSubscribed = false;
    };

    },[friend , currentUser  ])

    /////////////

   
   
    function checkEquality(a , b ) {
       if (currentUser && friend) { 
        return a == b
       }
    } 
  
    const clearChat =()=>{
        if (currentUser) {
            updateDoc(doc(db , 'chats' , getConvId(currentUser?.uid , friend.id)) , {
                creditAt :new Date().getHours()+':'+new Date().getMinutes(),
                messages : [] ,
                lastMessage : {text:'WAVE TO YOUR FRIEND'} ,
           })
           .catch((err)=>{
            console.log(err.message)
           })
        }
    }

    const ChatUploadPic = ()=>{
        var arr = messages
        
           setPicLoad(true)
           const bubbleRef = ref(storage , file.name )
           const uploadTask = uploadBytesResumable(bubbleRef , file)
///     /// to hav uploadin percentage 
        //    uploadTask.on('state_changed' , (snapshot)=>{
        //     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //     setUpVal(progress)
        //    })

           uploadTask
           .then(()=>{
               getDownloadURL(bubbleRef)
              .then((res)=>{
                arr.push({
                        // text:'photo',
                        sender : currentUser?.uid ,
                        creditAt : new Date(),
                        image : res ,  
                        viewers : [currentUser?.uid]
                    
                } ) 

                // setMessages(arr)
                updateDoc(doc(db , 'chats' , getConvId(currentUser?.uid , friend.id)) , {
                    creditAt :new Date() ,
                    messages : arr ,
                    lastMessage : {
                         text:'photo',
                        sender : currentUser?.uid ,
                        creditAt : new Date(),
                        image : res ,  
                        viewers : [currentUser?.uid]
                } 
               })
               
           
                
                
                
                })
                .then(()=>{
                    setPicLoad(false)
                    setFile(null)
                    setBadge(false)
                    // setURL('')
                })
                
            
        
           })




            
        
    }
  
  

     const sendMessage =(e)=>{  
      e.preventDefault()
        // ChatUploadPic()
        var arr = messages
          if (messageText !=='' || !file  && currentUser && friend ) {
            setMessageText('')
            arr.push(msgStructure)
            // setMessages(arr)
            updateDoc(doc(db , 'chats' , getConvId(currentUser?.uid , friend?.id)) , {
                 creditAt :new Date(),
                 viewers : [currentUser?.uid , friend?.id] ,
                 messages : arr ,
                 lastMessage : msgStructure ,
            })
            



            
          }
          if (file    && currentUser && params) {
            
            ChatUploadPic()
            // getChats()
          }
        }


        const markAllSeen =()=>{
            const arr = []
            messages?.map((message)=>{
              arr?.push({...message, viewers : [friend?.id, currentUser?.uid]})
            })
            return arr ;
        } 
    
    const lastMs= location?.state?.data?.chat?.lastMessage
    const viewers = lastMs?.viewers
        useEffect(() => {
          if (currentUser && viewers && chat ) {
            
            if (lastMs?.sender !== currentUser?.uid && viewers?.length==1) {
              updateDoc(doc(db , 'chats' , chat?.id  ),{
                messages : markAllSeen(),
                lastMessage : {
                  creditAt : chat?.lastMessage?.creditAt ,
                  sender : chat?.lastMessage?.sender ,
                  text : chat?.lastMessage?.text , 
                  viewers : [currentUser?.uid , friend?.id]
                }
              })


            }
            
         
            
          }
        }, [currentUser ,chat])

      

       
  return ( 
    <>
     
    <div  className="chatfeed col-lg-6 col-sm-12  pb-2  border-le  "   >
       
        <div className="chat-content -1 h-100 bg-dak  " style={{display:'flex' , flexDirection:'column', borderBottomColor:'transparent' , justifyContent:'space-between' }}  >
            <div className="chatfeed-header d-flex bg-info text-light" style={{justifyContent:'space-between'  , alignItems:'center'}}  >
            <div className="chatfeed-header d-flex py-2 bg-info text-light" >
                
                <div className="chat-img rounded-circle mx-2 profile-img" style={{backgroundImage:`url(${friend?.pdp}) ` , width:'50px', height:'50px' }} >
                    {/* <img className=''  width="50px" src={friend?.pdp} alt="" srcset="" /> */}
                    { friend?.isOnline &&  <div className=" ac-conv"></div>}
                </div>
               <Link className='link'  to={`/user=${friend?.id}`} state={{data : friend}} >
                 <div className="friend-info my-auto">
                      <small>{friend?.firstName + ' '+ friend?.lastName} </small>  <br />
                      <small className='text-' >@{friend?.username}</small>
                  </div>
               </Link>
                
            </div>
            <Button variant='outline-light'className='mx-2 text-light' size='sm' onClick={clearChat}  >  <FaTrashAlt  /> Clear</Button>
         </div>
{/* ////////////////mesagat */}    









  
 
          { convLoad ? 
            <div className="col-6 d-flex w-100 " style={{justifyContent:'center' , alignItems:'center'}} >
                <DotLoader
                    color="#2a84ce"
                    speedMultiplier={2}
                    />
            </div> 
             : 
            <div className="chat-mesgs px-3 mt-2 bg- h-100 ">
             
               <ConversationArea messages={messages} lastMessage={lastMs}   />

                {picLoad &&   
                <div className="msgcontainer d-flex my-1" style={{justifyContent:'flex-end'}}  >
                  <div className="progress mymsg text-light ">
                    <PuffLoader color='#0275d8' />
                  </div>
                </div>
                 }
           

               <div className='bg-dark' ref={myRef} />     
                
            </div>}  









 
{/* ///////////////////form */}
            <div className="form-con bg- py-1 bg-secondar">
             <Form
              onSubmit={sendMessage}
              // onSubmit={()=>{alert(messageText)}}
               >
                <div className="chat-form mb-2 bg-dar mx-3 py-2  px-3 rounded-pill  d-flex" style={{alignItems:'center' , backgroundColor:'white'  }}  >
                    <BsKeyboard size='30px' />
                   
                    <Form.Control   type='text' className='rounded-pill border-0 text-field  '  placeholder='type your message..' value={messageText} onChange={(e)=>{setMessageText(e.target.value)}}   />
                    <div className="chat-upload bg-daner">
                        <HiPhotograph   size='30px' className='mx-3'  cursor='pointer'/>
                        <input type="file" name="" id="" className='chat-upload-input'
                        accept='images/*'
                        onChange={(e)=>{setFile(e.target.files[0]) ; setBadge(true) }}
                         />
                        { badge &&  <div className="upload-badge fw-bol"><small>1</small></div>}
                    </div>
                    
                    <button className='border-0' type="submit" ><IoIosSend cursor='pointer' size='30px'  onClick={sendMessage}  /> </button>
                     


                </div>
                </Form>
            </div>

        </div>

    </div>








   
    </>
  )
}

export default ChatFeed