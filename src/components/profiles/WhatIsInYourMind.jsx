import { addDoc, doc, setDoc, updateDoc } from 'firebase/firestore'
import React, { useState } from 'react'
import {Form , Button, Alert, Modal} from 'react-bootstrap'
import {BsFillImageFill} from 'react-icons/bs'
import {IoIosSend} from 'react-icons/io'
// import { uuid } from 'uuidv4';
import { ClipLoader, SyncLoader } from 'react-spinners'
import { db, storage, useAuth } from '../Firebase'
import uuid from 'react-uuid'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { useMediaQuery } from 'usehooks-ts'
import {RiCloseCircleFill } from 'react-icons/ri'





function WhatIsInYourMind({username , url , load  , setNumOfPosts, numOfPosts }) {
    const isMobile = useMediaQuery('(max-width: 800px)')
    const currentUser = useAuth()
    const [file , setFile] = useState()
    const [postText , setPostText] = useState('')
    const [postLoad , setLoad  ] = useState(null)
    const [imgLoad , setImgLoad] = useState(null)
    const [URL , setURL  ] = useState('')
    const randomId = uuid()
    const [show , setShow] = useState(false)


    const uploadImage =(e)=>{
       setShow(false)
      if (file) {
        setImgLoad(true)
        const postRef = ref(storage , 'post-'+randomId )
        uploadBytes(postRef , file)
        .then(()=>{
          getDownloadURL(postRef)
          .then((res)=>{
          
          setURL(res)
          setImgLoad(false)
        })
        })
        
        
      }
    }

    const postHandel = (e)=>{
      // console.log(randomId)
      
      if (currentUser) {

        if( postText || URL ){
          setLoad(true)
          setDoc(doc(db , 'posts' , randomId ), {
           authorId : currentUser.uid ,
           id : randomId , 
           text : postText , 
           likers:[],
           comments :[],
           num_posts : 0 ,
           images : [URL] ,
           time : new Date() 
    
          })
          .then(()=>{
            
            setLoad(false)
            setNumOfPosts(numOfPosts+1)
            updateDoc(doc(db , 'users' , currentUser?.uid),{
              num_posts : numOfPosts+1
            })
            
            setFile()
            setPostText('')
            setURL('')
          })
          .catch((err)=>{
            console.log(err.message)
          })
    
        }



        // setLoad(false)
      }
 
      
    }

  return load ? <div className="w-100 post-idea text-center text-info bg-light py-2  border   "style={{borderRadius:'1em'}} >
                  <ClipLoader color='#5bc0de' />
                </div>
   :
   (
    <>
    <div className='post-idea p-3  ' >
       
         <div className="text-area d-flex border-botto " style={{alignItems:'center'}} >
          <div className="woym">
            <div className='profile-img rounded-circle border '  style={{backgroundImage:`url(${url})` , width:'40px' , height:'40px' }} ></div>
          </div>
            <Form.Control size={ isMobile ?  'sm' : ''}  placeholder={`What's on your mind, ${username} ?`} className='text-field rounded-pill bg-light mx-1'value={postText} onChange={(e)=>{setPostText(e.target.value)}} />
         </div>
              {!imgLoad && URL &&
                  <div className="post-rep bg-dager my-3  " >
                        <img src={URL} alt="" srcset="" width='200px' />
                        <RiCloseCircleFill  className='clear-rep' onClick={()=>{setURL("")}}  />
                  </div>
             
              }
              { imgLoad &&
                <div className="w-25 text-center bg-light mt-3 mx-3 py-5 border rounded  ">
                 <ClipLoader />
                </div>
              }
       
         <hr className='mb'  />
         <div className="post-idea-footer">
            <Button size= { isMobile ?  'sm' : ''} variant='outline-info' style={{border :'none'}} className="add-img w-50" onClick={()=>{setShow(true)}}  >
                <BsFillImageFill fontSize='25px' /> { isMobile ?  '' : 'Add image'}
            </Button>
            <Button  size= { isMobile ?  'sm' : ''}   onClick={postHandel}   variant='info' style={{border :'none'}} className="text-white add-img w-50">
                <IoIosSend fontSize='25px'    />  { isMobile ?  '' : 'Publich'}
            </Button>
         </div>
        
    </div>

      { postLoad &&  <div className="w-100 rounded bg- " style={{display:'flex' , justifyContent:'center' , alignItems:'center' , height:'3cm' , marginBottom:'0.5cm'  }}  >
          <SyncLoader speedMultiplier={0.5}
              className=''
              color="#1b96e5"
              loading
          />
      </div>}



      <Modal
      onHide={()=>{setShow(false)}}
            show={show}
            size=""
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                upload your photos
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Control accept='images/*' type='file' onChange={(e)=>{setFile(e.target.files[0])}} />
            </Modal.Body>
            <Modal.Footer>
              <Button variant='outline-info' onClick={()=>{setShow(false)}} >Cancel</Button>  
              <Button className='w-25 ' variant='info'  onClick={uploadImage} >Upload</Button>
            </Modal.Footer>
    </Modal>


    </>
  )
}

export default WhatIsInYourMind