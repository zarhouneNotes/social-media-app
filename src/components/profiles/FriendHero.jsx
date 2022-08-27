import { Button } from 'react-bootstrap'
import React , {useState , useEffect} from 'react'
import { Link, useLocation , useParams } from 'react-router-dom'
import  {useMediaQuery} from 'usehooks-ts'
import { db, useAuth } from '../Firebase'
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { BsCheck2Square } from 'react-icons/bs'
import {HiOutlineUserAdd} from 'react-icons/hi'
import { ClipLoader } from 'react-spinners'
import uuid from 'react-uuid'
import FullScreen from '../FullScreen'

function FriendHero({}) {
    const currentUser = useAuth()
    const location = useLocation()
    // const data = location.state?.data 
    const [load , setLoad] = useState()
    const [data , setData]= useState()
    const [myData , setMyData] = useState()
    const [followLoad , setFollowLoad] = useState(false)
    const params = useParams() 
    const isMobile = useMediaQuery('(max-width: 800px)')
    const dim = isMobile ? '120px' : '140px'
    const cov  =isMobile ? '200px' : '250px' 
   
    const notifStructure = {
        id  : uuid(),
        doer : currentUser?.uid ,
        target : currentUser?.uid ,
        new : 'started following you' ,
        isSeen : false ,
        type : 'follow' ,
        time : new Date()

    }


    function delItem(arr , item){
        let newList = arr.filter((a)=>{
             return a !== item
         })
         return newList ;
     }

    const amIIn = ()=>{
        return data?.followers?.includes(currentUser?.uid)
    }
///////friend
    useEffect(() => {
        setLoad(true)
        onSnapshot(doc(db , 'users' ,params?.id),(res)=>{
            setData(res.data())
            setLoad(false)
        } )
    }, [params])

    ///////mee
    useEffect(() => {
        if (currentUser) {
        onSnapshot(doc(db , 'users' ,currentUser?.uid),(res)=>{
            setMyData(res.data())
        } )
       } 
    //    console.log(delItem([1,2,3,4] , 3))
    }, [currentUser ])

    

    

    const followHandel =()=>{if (data) {
            const arr = data?.followers
            const myArr = myData?.following
            const notifs = data?.notification
          
            if (!amIIn()) {
                setFollowLoad(true)
                ////// arrays
                arr.push(currentUser?.uid)
                myArr.push(data?.id)
                notifs.push(notifStructure)
                updateDoc(doc(db , 'users' , data?.id),{
                    followers : arr ,
                    notification : notifs
                })
                .then(()=>{
                    ////notifi
                   
                    updateDoc(doc(db , 'users' , currentUser?.uid),{
                        following : myArr ,
                    }).then(()=>{
                        setFollowLoad(false)
                    })
                })
            }
            
            
            else{
                setFollowLoad(true)
                updateDoc(doc(db , 'users' , data?.id),{
                    followers : delItem(arr , currentUser?.uid)
                })
                .then(()=>{
                    updateDoc(doc(db , 'users' , currentUser?.uid),{
                        following : delItem(myArr , data?.id)
                    }).then(()=>{
                        setFollowLoad(false)
                    })
                })
               
            }
            
        }}
      
        const [seeProfile , setSeeProfile] = useState(false)
        const [seeCover , setSeeCover] = useState(false)

  return load ?   
    <div className="w-100 d-flex bg-light " style={{justifyContent:'center', minHeight:'50vh' , alignItems:'center'}}>
            <ClipLoader />
      </div>
   : (
    <div className='profile-hero w-100  ' >
        <div className="cover-img bg-light w-100" style={{height:cov}}  >

             
                            <img 
                            
                            onClick={()=>{setSeeCover(true)}}
                            src={data?.coverPhoto} alt="" srcset="" width="100%" height={cov}  />
                           
                       
        </div>    

        <div className="under-cover  " >


            <div className="personal-info bg-succe d-flex px-3 ">
                <div className="detains  ">
                   
                   <div className="profile-avatar bg-light rounded-circle" onClick={()=>{setSeeProfile(true)}}  style={{width:dim , height:dim , backgroundImage:`url(${data?.pdp})` , zIndex:"99" }} ></div>
                    
                    <div className='mx-2 bg-  mt-2' >
                        <h3 className='fw-bold  '> {data?.firstName + ' '+ data?.lastName}  </h3>
                        <h5 className="" >@{data?.username}  ({data?.job}) </h5> 
                    </div>
                </div>
                {/* <Button size="sm" className=' ' > <Link to='/update-profile' className='text-light '  >update  <MdOutlineModeEdit /></Link> </Button> */}
            </div>
  

         <h3 className='text-primary bio text-center'  >{data?.bio} </h3>

       { params?.id == currentUser?.uid &&  <div className="edit w-75 bg-warnng mx-auto mb-3">
                         
                         <Link className='link text-dark' to='/update-profile'>
                         <Button variant='light ' className='border bord w-100  '>
                        Edit
                        </Button>
                        </Link>
           </div>}

       {params?.id !== currentUser?.uid &&  <div className="btns w-100 px-3 d-flex mb-3" style={{justifyContent:'space-around'}}>
                <Link to={`/inbox/${data?.id}`}    style={{textDecoration:'none', width:'47%'}}>  
                 <Button variant='info w-100' className='text-white ' > message </Button>
                </Link>
                <Button  variant= 'outline-info' className='' style={{width:'47%'}} onClick={followHandel} >
                  { amIIn() && <span className='my-auto'>following <BsCheck2Square /> </span> }
                  {!amIIn() && <span>{ followLoad ? 'loading..' :<>follow <HiOutlineUserAdd /></>  }</span> }  
                  
                </Button>
            </div>}
        
            <div className="numbers w-100 col-md-8 mx-auto text-center" >
                <div className="detail">
                    <small className='text-secondary'>Posts</small>
                    <h4 className="fw-bold"> {data?.num_posts} </h4>
                </div>
                <div className="detail">
                <small className='text-secondary'>Followers</small>
                    <h4 className="fw-bold"> {data?.followers?.length} </h4>
                </div>
                <div className="detail">
                    <small className='text-secondary'>Following</small>
                    <h4 className="fw-bold"> {data?.following?.length} </h4>
                </div>
            </div>

           
            
        </div>    
        {seeCover && <FullScreen setSeenPic={setSeeCover} url={data?.coverPhoto} />}
        {seeProfile && <FullScreen setSeenPic={setSeeProfile} url={data?.pdp} />}
    </div>
  )
}

export default FriendHero