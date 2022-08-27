import React, { useEffect, useState } from 'react'
import { collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore'
import { db, useAuth } from './Firebase'
import {FcLike , FcLikePlaceholder} from 'react-icons/fc'
import {Form} from 'react-bootstrap'
import Comments from './Comments'
import Comment from './Comment'
import uuid from 'react-uuid'

import FullScreen from './FullScreen'

function OtherWallPost({data , postDetails}) {
    var userData = data
    const currentUser = useAuth()
    const [likers , setLikers] = useState([])
  const [comments , setComments] = useState([])
  const [openComments , setOpenComments] = useState(false)
    const d = new Date(postDetails?.time?.seconds*1000 )
    const mth = d.getMonth()
    const day = d.getDate()
    const notifStructure = {
      id  : uuid(),
      doer : currentUser?.uid ,
      target : postDetails?.id ,
      new : 'Liked your post' ,
      isSeen : false ,
      type :'like' ,
      time : new Date()
  
  }
    function isLessThanTen(t) {
      if (t<10) {
          return "0"+t
      }else{
          return t
      }
    }
    function isLikedByMe(){
      return likers?.includes(currentUser?.uid)
    }
      
    
  
    useEffect(() => {
      onSnapshot(doc(db , 'posts' , postDetails?.id),(res)=>{
        setLikers(res.data()?.likers)
        setComments(res.data()?.comments)
      })
    }, [currentUser])
  
  
  
  
    function delItem(arr , item){
      let newList = arr.filter((a)=>{
           return a !== item
       })
       return newList ;
   }
  
  
  
    const likeHandel = (e)=>{
      e.preventDefault()
      const arr = likers
      const notifs = userData?.notification
      if (!isLikedByMe() && currentUser) {
        arr.push(currentUser?.uid)
        notifs?.push(notifStructure)
        updateDoc(doc(db , 'posts' , postDetails?.id),{
          likers : arr
        })
        updateDoc(doc(db , 'users' , postDetails?.authorId),{
          notification : notifs
        })
        
      } else{
        updateDoc(doc(db , 'posts' , postDetails?.id),{
          likers : delItem(arr , currentUser?.uid)
        })
      }
    
    }
  

    const [openPic , setOpenPic] = useState(false)
  
  return (
    <div className='post mt-3'  >

        <div className="post-header px-3 py-2" style={{display:'flex' , alignItems:'center'}} >
        <div className="av profile-img rounded-circle border "  style={{backgroundImage:`url(${userData.pdp})` , width:'50px' , height:'50px '}} >
        </div>
            <div className="userinfo my-1 mx-1 ">
            <div className='fw-bold'> <small>   {userData?.firstName}  {userData?.lastName} </small> </div>
            <div className='text-secondary'> <small>@{userData?.username}</small>   </div>
            </div>
        </div>


    <div className="post-body">
      <p className='pt-2 px-3'   > 
        <small>
          {postDetails?.text}
        </small>
     </p>
      <div className="images" style={{transform :'scale("0.5")'}} >
        {postDetails.images?.map((url)=>{
         return   <img onClick={()=>{setOpenPic(true)}} src={url} alt="" key={url} srcset="" width='100%'  />
        })}
        
      </div>
    <div className=" p-2 px-3 d-flex"style={{alignItems:'center' , justifyContent:'space-between' }}  >
      <div className='reactions d-flex'style={{alignItems:'center' , justifyContent:'space-between' }}  >
       
        <div className='mx-1' > 
            <span className="fw-bold my-auto ">{likers?.length}</span> 
           <Form.Text className='my-auto mx-1'>likes</Form.Text> </div>  
           <span className="fw-bold my-auto ">{0}</span> 
           <Form.Text className='my-auto mx-1' onClick={()=>{setOpenComments(true)}} >comments</Form.Text> 

        </div>
     

     
      <small className="text-secondary">  { day!==  new Date().getDate() ? isLessThanTen(day)+"/"+isLessThanTen(mth) : 'today at' } , {isLessThanTen(d.getHours())+':'+ isLessThanTen(d.getMinutes()) }</small>
    </div>
    </div> 


    
  <div className="post-footer  py-2 " style={{display:'flex' , justifyContent:'space-evenly' , borderTop : '1px lightgrey solid' }}   >
    
  <div className={ ` text-center react-btn w-100  ${isLikedByMe()  ? 'text-info fw-bold' : 'text-secondary'}  `}  onClick={likeHandel}     >  
          Like
        </div>

        <div className='bg-' style={{width : "1px" , background:'lightgrey' }}     ></div>
        
        <div className={ ` text-center react-btn w-100  text-secondary`} onClick={()=>{setOpenComments(true)}}  >
           Comment
        </div>
        <div className={`comments bg-lt col-lg-6 col-12 ${openComments ? 'open-comments' : ''} `}>
          <Comments postId={postDetails?.id} setOpenComments={setOpenComments}  />
          
        </div>
    </div>

    { comments?.length !== 0 && <div className=' py-1 ' style={{backgroundColor:'rgb(236, 236, 236)'}} >
     <Comment com={comments[comments?.length-1]} />
     </div>}
     { openPic &&  <FullScreen url={postDetails?.images[0]} setSeenPic={setOpenPic}  />}
  

  </div>
  )
}

export default OtherWallPost