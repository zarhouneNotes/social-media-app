import { Modal,Form } from 'react-bootstrap'
import React,{useEffect, useState} from 'react'
import { db, useAuth } from '../Firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'

function FollowingModal({ShowFollowing , setShowFollowing}) {
    const currentUser = useAuth()
    const [followings , setFollowings] = useState()
    const [load , setLoad] = useState()
    useEffect(() => {
      let isMounted = true
        if (currentUser) {
            const list = []
            if (isMounted) {
              setLoad(true)
              getDocs(query(collection(db , 'users'),where('followers' ,"array-contains" , currentUser?.uid)))
            .then((res)=>{
              res.docs.forEach((doc)=>{
                  list.push(doc.data())
              })
              setFollowings(list)
              setLoad(false)
            })
            }
        }
      return () => {
        isMounted = false
      };
    }, [currentUser])
    ////////////componenen
 function Following ({following}){
    return (
   <Link to={`/${following?.id}`}  state={{data : following}} className='text-dark' style={{textDecoration:'none'}} >
    <div className='d-flex mb-3'>
        <div className="profile-img rounded-circle" style={{backgroundImage:`url(${following?.pdp})`}}></div>
        <p className='mx-2 my-auto '>{following?.username} </p>
    </div> 
    </Link>
    )
 }

  return (
   <Modal
    show={ShowFollowing}
    onHide={() => setShowFollowing(false)}
    aria-labelledby="contained-modal-title-vcenter"
    centered
  > 
    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-vcenter">
        Following
      </Modal.Title>
    </Modal.Header>
    <Modal.Body style={{overflowY:'scroll' , maxHeight:'60vh', minHeight:'30vh'}} >
      {!load &&  followings?.map((following)=>{
        return  <Following following={following} />
      })   
      }

      

     {!load && followings?.length ==0 && 
     <div className="w-100 d-flex bg-wrning " style={{justifyContent:'center',maxHeight:'60vh', minHeight:'30vh' , alignItems:'center'}}>
     <Form.Text>You are not following anyone -__- </Form.Text>
   </div>
     }
      {load && 
      <div className="w-100 d-flex bg-wrning " style={{justifyContent:'center',maxHeight:'60vh', minHeight:'30vh' , alignItems:'center'}}>
        <ClipLoader />
      </div>
      }
    </Modal.Body>
    
  </Modal>
  )
}

export default FollowingModal ;