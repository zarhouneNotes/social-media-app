import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'
import {BiSearch} from 'react-icons/bi'
import User from './User'
import {useAuth , db } from '../Firebase'
import {collection, onSnapshot, query, where  } from 'firebase/firestore'
import {IoIosArrowDropleft} from 'react-icons/io'
import {useMediaQuery} from 'usehooks-ts'
import { ClipLoader } from 'react-spinners'

function Friends() {
    
    const isMobile = useMediaQuery('(max-width: 800px)')
    const currentUser = useAuth()
    const [users , setUsers] = useState([])
    const  [load , setLoad] = useState(null)
    useEffect(() => {
        setLoad(true)
        if (currentUser) {
            onSnapshot(
                query(
                    collection(db , 'users') , 
                    where("id", "!=", currentUser.uid)
                    ) , (snapshot ) =>{
                        const Data = []
                            snapshot.forEach((doc)=>{
                                Data.push(doc.data())
                            })
                            setUsers(Data)
                            setLoad(false)
                    } )
        }
       },[currentUser])

  return (
    <div   className={`mt-3 friends ${isMobile ? "col-2" : "col-3"}`} >
        <div className="friends-container    bg-lght"    >
        {!isMobile &&     <>
              <div className="list-header d-flex   py-3" style={{justifyContent : 'space-between'}} >
                <h5 className='my-auto' >All Users</h5>
                {/* <Form.Control type='text' placeholder='look for a friend..' size="sm" className='mx-1 rounded-pill' /> */}
                <BiSearch className='my-auto  fs-3'    />

               
              </div>
              {/* <hr /> */}
            </>}

            {load && 
            <div  className="w-100    text-center text-info bg-      "style={{borderRadius:'1em' , padding:'3cm 0px' , marginTop:'0.5cm'  }} >
                <ClipLoader color='#5bc0de' />
            </div>
            
            }

           {!load && <div className='mt ' style={{overflowX:'scroll'}} >
                { users?.map((user)=>{
                            return <User tel={isMobile} key={user.id} details={user}  />
                } )
                    
                }
              
            </div>}
        </div>
      
    </div>
  )
}

export default Friends