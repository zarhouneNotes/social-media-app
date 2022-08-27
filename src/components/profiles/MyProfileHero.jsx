import React ,{useState} from 'react'
import {Button, Form, Modal }  from 'react-bootstrap'
import  {Link} from 'react-router-dom'
import {  MdPhotoCamera } from 'react-icons/md'
import { db, storage, useAuth } from '../Firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { doc, updateDoc } from 'firebase/firestore'
import ClipLoader from 'react-spinners/ClipLoader'
import {useMediaQuery} from 'usehooks-ts'
import FollowersModal from './FollowersModal'
import FollowingModal from './FollowingModal'
import uuid from 'react-uuid'
import FullScreen from '../FullScreen'


function MyProfileHero({setCoverURL,load  ,  setPhotoUrl ,  photoUrl,coverURL,firstName,lastName, username, followers, following, numOfPosts , bio , job  }) {
    const currentUser = useAuth()
    const isMobile = useMediaQuery('(max-width: 800px)')
    //////models
    const [show, setShow] = useState(false);
    const [showCover, setShowCover] = useState(false);
    const [ShowFollowers , setShowFollowers] = useState(false)
    const [ShowFollowing , setShowFollowing] = useState(false)   
   
    const [Loading , setLoading] = useState(false)
    const [coverLoad , setCoverLoad] = useState(null)
    const [photo , setPhoto] = useState() 
    const [cover , setCover] = useState()



const CoverHandel = (e)=>{
    e.preventDefault()

     const coverRef  = ref(storage , "cover"+uuid())

      if (cover && currentUser) {
        setShowCover(false)
        setCoverLoad(true)
        uploadBytes(coverRef , cover)
        .then(()=>{
            getDownloadURL(coverRef)
            .then((res)=> {
                ///// update 
                setCoverURL(res)
                updateDoc(doc(db , 'users' , currentUser.uid ) , {
                    coverPhoto : res
                })
                .then(()=>{
                    setCoverLoad(false)
                })
                .catch((err)=>{
                    console.log(err.message)
                })





            })
            .catch((err)=>{
                console.log(err.message)
            })
        })

    }
    }
    const profileHandl = (e)=>{
        e.preventDefault()

        const photoRef  = ref(storage , "photo"+currentUser.uid)

      if (photo && currentUser) {
        setShow(false)
        setLoading(true)
        uploadBytes(photoRef , photo)
        .then(()=>{
            getDownloadURL(photoRef)
            .then((res)=> {
                ///// update 
                setPhotoUrl(res)
                updateDoc(doc(db , 'users' , currentUser.uid ) , {
                    pdp : res
                })
                .then(()=>{
                    setLoading(false)
                })
                .catch((err)=>{
                    console.log(err.message)
                })





            })
            .catch((err)=>{
                console.log(err.message)
            })
        })

      }

    }
    





const dim = isMobile ? '120px' : '140px'
const cov  =isMobile ? '200px' : '250px' 
const [seeProfile , setSeeProfile] = useState(false)
const [seeCover , setSeeCover] = useState(false)
  return load ? 
                     <div  className="w-100  text-center text-info bg-light      "style={{borderRadius:'1em' , padding:'3cm 0px' , marginTop:'13vh'  }} >
                        <ClipLoader color='#5bc0de' />
                    </div>
  : (
    <>
    <div className='profile-hero w-100' >
        <div className="cover-img bg-ligh w-100" style={{height:cov}}  >

                { coverLoad &&  
                <div className="h-100 w-100 rounded- bg-light " style={{display:'flex' , justifyContent:'center' , alignItems:'center'}}  >
                                    <ClipLoader
                                        className=''
                                        color="#1b96e5"
                                        loading
                                    />
                </div>}
                    { !coverLoad &&   
                    <>
                            <img 
                            onClick={()=>{setSeeCover(true)}}
                            src={coverURL} alt="" srcset="" width="100%" height={cov} 
                             />
                            {/* <div className="banner bg- profile-img" style={{width:"100%" ,height:"250px" , backgroundImage:`url(${coverURL})` }} ></div> */}
                            <div className="cam"  onClick={()=>{setShowCover(true)}}    >
                            <MdPhotoCamera fontSize="20px" className='m-2' />
                            </div>
                        </>}
        </div>    

        <div className="under-cover   " >


            <div className="personal-info bg-succe d-flex px-3 ">
                <div className="detains ">
                    <div className="pro-img  rounded-circle" style={{width:dim , height:dim }}  >
                  
                   { Loading &&  
                   <div className="h-100 w-100 rounded-circle bg-light " style={{display:'flex' , justifyContent:'center' , alignItems:'center'}}  >
                        <ClipLoader
                            className=''
                            color="#1b96e5"
                            loading
                        />
                    </div>}
                      
                    { !Loading &&
                     <> 
                        {/* <img src={photoUrl} alt="" srcset="" width={dim} height={dim}  className='r profile-avatar '/> */}
                        <div 
                        onClick={()=>{setSeeProfile(true)}}
                        className="profile-avatar full bg-light rounded-circle" style={{width:dim , height:dim , backgroundImage:`url(${photoUrl})` }} ></div>
                        <div className="cam2 "  onClick={()=>{setShow (true)}} >
                            <MdPhotoCamera fontSize={isMobile ? "13px" : "16px"} className='m-2' />
                        </div>
                     </> }

                    </div>
                    <div className='mt-2 mx-2 bg-' >
                        <h3 className='fw-bold  '> {firstName + ' '+ lastName}    </h3>
                        <h5 className="" >@{username}, ({job}) </h5> 
                    </div>
                </div>
                {/* <Button size="sm" className=' ' > <Link to='/update-profile' className='text-light '  >{!isMobile &&   'update'}  <MdOutlineModeEdit /></Link> </Button> */}
            </div>


        {/* <hr className='w-50 mx-auto' /> */}
            <h3 className='text-primary bio text-center'  >{bio} </h3>
            <div className="edit w-75 bg-warnng mx-auto mb-3">
                         
                          <Link className='link text-dark' to='/update-profile'>
                            <Button variant='light ' className='border bord w-100  '>
                                Edit
                            </Button>
                         </Link>
            </div>
  
        {/* <hr className='w-50 mx-auto' /> */}
          
            <div className="numbers col-md-12 mx-auto text-center" >
                <div className="detail">
                    <small className='text-secondary'>POSTS</small>
                    <h4 className="fw-bold"> {numOfPosts} </h4>
                </div>
                <div className="detail">
                   <small className='text-secondary' onClick={()=>{setShowFollowers(true)}} >FOLLOWERS</small>
                    <h4 className="fw-bold"> {followers?.length} </h4>
                </div>
                <div className="detail">
                    <small className='text-secondary' onClick={()=>{setShowFollowing(true)}} >FOLLOWING</small>
                    <h4 className="fw-bold"> {following?.length} </h4>
                </div>
            </div>
            
        </div>    
    </div>
    {/* //////////// models  */}
      <Modal show={show}    onHide={()=>{setShow(false)}} >
        <Modal.Header closeButton>
          <Modal.Title>Upload your photo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Control type='file'  accept='image/*' onChange={(e)=>{setPhoto(e.target.files[0])}}  />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary"  onClick={profileHandl} >
            update photo
          </Button>
        </Modal.Footer>
      </Modal>

      {/* cover model */}

      <Modal show={showCover}    onHide={()=>{setShowCover(false)}} >
        <Modal.Header closeButton>
          <Modal.Title>Upload your Cover </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Control type='file'  accept='image/*' onChange={(e)=>{
                setCover(e.target.files[0])
            }} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary"  onClick={CoverHandel} >
            update cover
          </Button>
        </Modal.Footer>
      </Modal>

      {/* //////// follooowers */}

    <FollowersModal ShowFollowers={ShowFollowers} setShowFollowers={setShowFollowers} />
    <FollowingModal  ShowFollowing={ShowFollowing} setShowFollowing={setShowFollowing}/>
    {seeCover && <FullScreen setSeenPic={setSeeCover} url={coverURL} />}
    {seeProfile && <FullScreen setSeenPic={setSeeProfile} url={photoUrl} />}
            
        
    </>
  )
}

export default MyProfileHero