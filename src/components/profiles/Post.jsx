import {  doc, onSnapshot, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db, useAuth } from '../Firebase'
import {Form} from 'react-bootstrap'
import Comments from '../Comments'
import Comment from '../Comment'
import FullScreen from '../FullScreen'

function Post({ post, username , firstName , lastName , url  }) {

  const currentUser = useAuth()
  const postDetails = post
  // const [postDetails , setPostDetails] = useState()
  const d = new Date(postDetails?.time?.seconds*1000 )
  const mth = d.getMonth()+1
  const day = d.getDate()
  const [likers , setLikers] = useState([])
  const [comments , setComments] = useState([])
  const [openComments , setOpenComments] = useState(false)

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
    onSnapshot(doc(db , 'posts' , post?.id),(res)=>{
      // setPostDetails(res.data())
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
    if (!isLikedByMe() && currentUser) {
      arr.push(currentUser?.uid)
      updateDoc(doc(db , 'posts' , postDetails?.id),{
        likers : arr
      })
      
    } else{
      updateDoc(doc(db , 'posts' , postDetails?.id),{
        likers : delItem(arr , currentUser?.uid)
      })
    }
  
  }




 
  



  const [openPic , setOpenPic] = useState(false)
  return (
    <div className='post'  >
      <div className="post-header px-3 py-2" style={{display:'flex' , alignItems:'center'}} >
        <div className="av profile-img rounded-circle border "  style={{backgroundImage:`url(${url})` , width:'50px' , height:'50px '}} >
          {/* <img src={url} className='rounded-circle'  width="50px" height='50px' alt="" /> */}
        </div>
        <div className="userinfo my-1 mx-1 ">
          <div className='fw-bold'> <small>{firstName} {lastName}</small> </div>
          <div className='text-secondary'> <small>@{username}</small>   </div>
        </div>
      </div>
      <div className="post-body">
        <p className='pt-2 px-3'   > 
          <small>
            {postDetails?.text}
          </small>
       </p>
        <div className="images" style={{transform :'scale("0.5")'}} >
          {postDetails?.images?.map((url)=>{
           return   <img key={url} src={url} alt="" srcset="" width='100%'
           onClick={()=>{setOpenPic(true)}}
             />
          })}
          
        </div>
      <div className=" p-2 px-3 d-flex"style={{alignItems:'center' , justifyContent:'space-between' }}  >

        <div className='reactions d-flex'style={{alignItems:'center' , justifyContent:'space-between' }}  >

       <div className='mx-1' > 
       <span className="fw-bold my-auto ">{likers?.length}</span> 
           <Form.Text className='my-auto mx-1'>likes</Form.Text> 
           <span className="fw-bold my-auto ">{comments?.length}</span> 
           <Form.Text className='my-auto mx-1' onClick={()=>{setOpenComments(true)}} >comments</Form.Text> 
       </div>  
           
        </div> 
        
        

        <small className="text-secondary">{ day!==  new Date().getDate() ? isLessThanTen(day)+"/"+isLessThanTen(mth) : 'today at' } , {isLessThanTen(d.getHours())+':'+ isLessThanTen(d.getMinutes()) }</small>
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
    // <>hy</>
  )
}

export default Post