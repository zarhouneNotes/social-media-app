import {  doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db, useAuth } from './Firebase'
import {useParams} from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import {Form} from 'react-bootstrap'
import Comments from './Comments'
import Comment from './Comment'
import { useRef } from 'react'
import uuid from 'react-uuid'
import FullScreen from './FullScreen'


function OtherPost({ postDetails ,   key}) {

  const currentUser = useAuth()
  const postRef  =  useRef() 
  
  
  const [userData , setUserData] = useState({})
  const params = useParams()
  const [likers , setLikers] = useState([])
  const [comments , setComments] = useState([])
  const [openComments , setOpenComments] = useState(false)
  const [load ,setLoad] = useState()
  const underComs = useRef()
  const notifStructure = {
    id  : uuid(),
    doer : currentUser?.uid ,
    target : postDetails?.id ,
    new : 'Liked your post' ,
    isSeen : false ,
    type :'like' ,
    time : new Date()

}
  const d = new Date(postDetails?.time?.seconds*1000 )
  const mth = d.getMonth()+1
  const day = d.getDate()
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
    var timer
    if (params?.ref == postDetails?.id) {
      postRef?.current?.scrollIntoView({block :'center' , behavior : "auto"})
      
      // 
      timer = setTimeout(() => {
        setOpenComments(params?.opcom)
      }, 1000);
      return () => clearTimeout(timer);
    }
    return ;
   
   
  }, [params])


  
  useEffect(() => {
    setLoad(true)
      if (postDetails.authorId) {
        getDoc(doc(db  , 'users' , postDetails.authorId))
        .then((res)=>{
            setUserData(res.data())

            setLoad(false)
        })
      }
  }, [postDetails])    

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
      notifs?.push(notifStructure)
      arr.push(currentUser?.uid)
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

  return  (
    <div  className='post' ref={postRef}      >
    
        <div className="post-header px-3 py-2" style={{display:'flex' , alignItems:'center'}} >
          {load && <div  className="w- px-5    text-center text-info bg-light  d-flex    "style={{borderRadius:'1em' , justifyContent:'center'     }} >
                    <ClipLoader color='#5bc0de' />
                  </div>}
          {!load && 
          <Link className='d-flex' to={`/user=${userData?.id}`} style={{color:'black' , textDecoration :'none'}} state={{data :userData }}>
          
          <div className="av profile-img rounded-circle border "  style={{backgroundImage:`url(${userData.pdp})` , width:'50px' , height:'50px '}} >
        </div>
              
              <div className="userinfo my-1 mx-1 ">
                <div className='fw-bold'> <small>   {userData.firstName}  {userData.lastName} </small> </div>
                <div className='text-secondary'> <small>@{userData.username}</small>   </div>
              </div>
            
          </Link>
          
          }
        </div>  
      <div className="post-body">
        <p className='pt-2 px-3'   > 
          <small>
            {postDetails.text}
          </small>
       </p>
        <div className="images" style={{transform :'scale("0.5")'}} >
          {postDetails.images?.map((url)=>{
           return   <img onClick={()=>{setOpenPic(true)}} src={url} alt="" key={url} srcset="" width='100%'  style={{cursor:'pointer'}} />
          })}
          
        </div>
      <div className=" p-2 px-3 d-flex"style={{alignItems:'center' , justifyContent:'space-between' }}  >
        <div className='reactions d-flex'style={{alignItems:'center' , justifyContent:'space-between' }}  >
          {/* ////////////////////////: */}


          <div className='mx-1' > 
            <span className="fw-bold my-auto ">{likers?.length}</span> 
           <Form.Text className='my-auto mx-1'>likes</Form.Text> </div>  
           <span className="fw-bold my-auto ">{comments?.length}</span> 
           <Form.Text className='my-auto mx-1' onClick={()=>{setOpenComments(true)}}>comments</Form.Text> 
        </div>
         

        {/* ////////////// */}
        <small className="text-secondary">  { day!==  new Date().getDate() ? isLessThanTen(day)+"/"+isLessThanTen(mth) : 'today at' } , {isLessThanTen(d.getHours())+':'+ isLessThanTen(d.getMinutes()) } </small>
      </div>
      </div>
      
      <div className="post-footer  py-2 border-top border-bottom " style={{display:'flex' , justifyContent:'space-evenly'  }}   >
      
         <div className={ ` text-center react-btn w-100  ${isLikedByMe()  ? 'text-info fw-bold' : 'text-secondary'}  `}  onClick={likeHandel}     >  
          Like
        </div>

        <div className='bg-' style={{width : "1px" , background:'lightgrey' }}     ></div>
        
        <div className={ ` text-center react-btn w-100  text-secondary`} onClick={()=>{setOpenComments(true)}}  >
           Comment
        </div>

        <div className={`comments bg-lt col-lg-6 col-12 ${openComments== 'true' ||openComments== true  ? 'open-comments' : ''} `}>
          <Comments data={userData} post={postDetails} postId={postDetails?.id} setOpenComments={setOpenComments}  />
          <div ref={underComs} />
        </div>
      </div>
      

     { comments?.length !== 0 && 
     <div  onClick={()=>{setOpenComments(true)}} className=' py-1 ' style={{backgroundColor:'rgb(236, 236, 236)'}} >
      <Comment com={comments[comments?.length-1]} />
     </div>}
      { openPic &&  <FullScreen url={postDetails?.images[0]} setSeenPic={setOpenPic}  />}
    </div>
    
  )
}

export default OtherPost