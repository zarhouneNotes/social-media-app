import { collection, doc, getDocs  ,onSnapshot, orderBy, query, where} from 'firebase/firestore'
import React,{useEffect, useState} from 'react'
/////////////   react router dom
import {Link, NavLink} from 'react-router-dom'
import { Form , Button , Dropdown , ButtonGroup } from 'react-bootstrap'
import {ReactComponent as Logo} from '../images/logo.svg'
/////////iconss
import  {BiMessageDetail, BiSearch} from 'react-icons/bi'
import {AiOutlineLogout  , AiFillHome , AiOutlineHome, AiOutlineClose} from 'react-icons/ai'
import {CgProfile} from 'react-icons/cg'
import {RiContactsLine} from 'react-icons/ri'
import {IoNotificationsOutline , IoArrowBackOutline} from 'react-icons/io5'
import {IoMdNotifications} from 'react-icons/io'
import {FiEdit} from 'react-icons/fi'

/////hooks
import { useMediaQuery } from 'usehooks-ts'
import { db, useAuth } from './Firebase'
import logo from '../images/logo.png'
import {useParams} from 'react-router-dom'
import AllFriends from './AllFriends'
import Notifs from './Notifs'
import { SiGooglemessages } from 'react-icons/si'
import Suggestions from './Suggestions'
import { useRef } from 'react'




function Navbar({url , username , khrj , firstname , lastname , notif }) {

  const isMobile = useMediaQuery('(max-width: 800px)')
  const currentUser = useAuth()
  const params = useParams()
  const [friends , setFriends] = useState([])
  const [badge , setBadge] = useState(0)
  const [show , setShow] = useState(false)
  const [openNotif , setOpenNotif] = useState(null)
  const [notifs , setNotifs] = useState([])

  
 
  useEffect(() => {
    if (currentUser) {
      const convs = []
      onSnapshot(query(collection(db , 'chats'), where('users' , 'array-contains' ,currentUser.uid ) , orderBy('creditAt' , "desc") ),(snapshot)=>{
        var bdg = 0
        snapshot?.docs?.forEach((doc , i)=>{
                 var   chat = doc.data()
                

                  if (chat?.lastMessage?.sender !== currentUser?.uid && chat?.lastMessage?.viewers?.length ==1 ) { 
                    bdg+=1    
                  }

                  setBadge(bdg)
               
         
          
        }) 
         
      })
     
    // console.log(currentUser) 
    }
    
  },[currentUser ,params ]) 

  useEffect(()=>{
    if (currentUser) {
      const users = []
      getDocs(query(collection(db , 'users' ) , where('id' ,'!=' , currentUser?.uid)))
      .then((res)=>{
        res.docs.forEach((doc)=>{
          users.push(doc.data())
          setFriends(users)
          // console.log(friends)
        })
        
      })
    }
  },[currentUser])

  const [notifB , setNotifB] = useState(0)
  useEffect(() => {
    if (currentUser) {
      var notifBadge=0;
      onSnapshot(doc(db , 'users' , currentUser.uid),(res)=>{
        setNotifs(res.data()?.notification)
        res?.data()?.notification?.map((notif)=>{
            if(!notif.isSeen && notif?.doer !== currentUser?.uid ){
              notifBadge+=1
              
            }
            setNotifB(notifBadge)
        })
          
      })
      
    }
  }, [currentUser , params])

  // const countNotifs = ()=>{
    
  // }


 const [showForm , setShowForm] = useState(false)
 const [showSuggestions , setShowSuggestions] = useState(false)
 const [list , setList] = useState([])
 const [formValue , setFormValue] = useState('')
 const formRef = useRef()


useEffect(() => {
  if (formValue) {
    setShowSuggestions(true)
    const arr= []
    onSnapshot(query(collection(db , 'users' )),(res)=>{
      res.docs.forEach((doc)=>{
        if (doc.data()?.displayName?.toLowerCase().includes(formValue.toLowerCase())) {
          arr.push(doc.data())
        }
        
      })

      // console.log(arr)
      setList(arr)
      
    })
  }else{
    setShowSuggestions(false)
    setList([])
  }
}, [formValue])

useEffect(() => {
 if (isMobile) {
  setShowForm(false)
  setShowSuggestions(false)
 }
}, [isMobile])



  return (
    <>
    <div className='bg-li    navbar  ' >
      <div className='bg-dager d-flex bg-succss  logo-part ' style={{justifyContent:'space-between'}} >
        
          <Link to='/' style={{textDecoration:'none' , color:'black'}} >
            <div className=" logo-container bg-dange my-auto ">
            
                {/* <img src={logo} className='my-ato' alt="" srcset="" width='40px'/> */}
                
                <h3 className='mx-2 logoname text-info fw-bod  my-auto bordr border-inf ' >SHICIAL</h3> 
                
            </div>
          </Link>
          {true &&  
          <div className={`form-search ${showForm ?"open-search" :""}`} >
            <div className='w-100 search-con'>
              <div className="w-100   d-flex">
              {isMobile && <IoArrowBackOutline 
                             onClick={()=>{setShowForm(false) ; setShowSuggestions(false)}}
                             className='my-auto fs-4 mx-2'
               />}
               <Form.Control  
               ref={formRef}
              //  onFocus={()=>{setShowSuggestions(true)}}
              //  onBlur={()=>{setShowSuggestions(false)}}
               value={formValue}
               onChange={(e)=>{setFormValue(e.target.value)}}
               placeholder='search for people..' size={isMobile ? 'sm' : ''} 
               className={` w-100 bg-light search-bar text-field  border-0 bg-light p-2  rounded-pll `} />
              {isMobile && <AiOutlineClose onClick={()=>{setFormValue('') ; formRef?.current?.focus()}} className='my-auto fs-4 mx-2' />}
              </div>
             { showSuggestions && <Suggestions setShowForm={setShowForm} setShowSuggestions={setShowSuggestions} list={list} />}
            </div>
          </div>
          }
        </div> 



        <div className={`user-dash  d-flex bg-dangr   ${isMobile ? '' : 'dash-w'}`}>
            <div className="user-av-nam bg-daner">
          
                        <NavLink   className={({ isActive }) =>  isActive ? 'text-info  mx-1' : 'text-secondary mx-1 ' }    to='/'> 
                              <AiFillHome fontSize="30px" className={`home-icon `} />
                        </NavLink>
                         {/* } */}
                        { isMobile && 
                        <BiSearch

                         onClick={()=>{setShowForm(true) ; setFormValue('') ; formRef?.current?.focus() }}
                         cursor='pointer' 
                         fontSize="30px"
                         className={`  text-secondary mx-1 home-icon  `} style={{minWidth:'30px'}}  /> }

                       
                         <div className="nav-inbox-icon mx-1 "> 
                            <NavLink  className={({ isActive }) =>  isActive ? 'text-info  ' : 'text-secondary' }  to='/inbox'> 
                              <BiMessageDetail  fontSize="30px"className={`   home-icon  `} /> 
                            </NavLink>
                           { badge >0 &&  <div className='inbox-badge'><small>{badge}</small></div>}
                        </div> 

                        <div className='notif-icon' >
                          <IoMdNotifications cursor='pointer' fontSize="30px"className={`  text-secondary mx-1 home-icon  `} style={{minWidth:'30px'}} onClick={()=>{setOpenNotif(true)}} /> 
                          { notifB>0 &&  <small className='notifbadge'>{notifB}</small>}
                        </div>
                        

                       
                    
                        <div className="user d-flex  bg-daner">
                            <div className="profile-img rounded-circle " style={{backgroundImage:`url(${url})`}} >
                            {/* <img src={url} width="40px"className='rounded-circle mx-' /> */}
                            </div>
                          <Link to='/my-profile' className='text-dark mx-1 my-auto' style={{textDecoration:'none'}}>   
                          { !isMobile && <h5 className='text-primay mx-1 fw-bod my-auto' >{username}</h5>}
                         </Link>
                        </div>
                        
                

              

                
            </div>
            <Dropdown className='dropdown'   as={ButtonGroup}>

                <Dropdown.Toggle split variant="" id="dropdown-split-baic" />
                  
                
                <Dropdown.Menu  style={{minWidth:'200px' , fontSize:'18px' , marginTop:'20px'}}  >
                  
                                    
                    { isMobile &&   <Dropdown.Item ><NavLink style={{textDecoration:'none'}} to='/' className={({ isActive }) =>  isActive ? 'text-info  ' : 'text-secondary ' }  >   <AiOutlineHome /> Home </NavLink></Dropdown.Item>   }
                    { isMobile &&   <Dropdown.Item    >           <NavLink style={{textDecoration:'none'}} to='/inbox' className={({ isActive }) =>  isActive ? 'text-info  ' : 'text-secondary ' }  ><BiMessageDetail/> Inbox</NavLink>  </Dropdown.Item> }
                    { isMobile &&   <Dropdown.Item  onClick={()=>{setShow(true)}}  className='text-secondary'   >           <RiContactsLine/> Friends </Dropdown.Item> }
                    { isMobile &&   <Dropdown.Item  onClick={()=>{setOpenNotif(true)}}  className='text-secondary'   >           <IoNotificationsOutline/> Notifications </Dropdown.Item> }
                                    <Dropdown.Item    >           <NavLink style={{textDecoration:'none'}} to="/my-profile" className={({ isActive }) =>  isActive ? 'text-info  ' : 'text-secondary ' }   ><CgProfile /> Profile</NavLink>  </Dropdown.Item>
                                    <Dropdown.Item  >             <NavLink style={{textDecoration:'none'}} to="/update-profile" className={({ isActive }) =>  isActive ? 'text-info  ' : 'text-secondary ' }  ><FiEdit /> Update profile</NavLink> </Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={khrj}><AiOutlineLogout  /> Log Out</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            
            
            
        </div>

    </div>
    <Notifs notifs={notifs}  openNotif={openNotif} setOpenNotif={setOpenNotif} />

    <AllFriends friends={friends} show={show} setShow={setShow} />

    </>
  )
}

export default Navbar