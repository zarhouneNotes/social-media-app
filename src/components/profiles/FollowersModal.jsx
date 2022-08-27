import { Modal,Form } from 'react-bootstrap'
import React,{useEffect, useState} from 'react'
import { db, useAuth } from '../Firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'

function FollowersModal({ShowFollowers , setShowFollowers}) {
    const currentUser = useAuth()
    const [followers , setFollowers] = useState()
    const [load , setLoad] = useState()
    useEffect(() => {
      let isMounted = true
        if (currentUser) {
            const list = []
            if (isMounted) {
              setLoad(true)
              getDocs(query(collection(db , 'users'),where('following' ,"array-contains" , currentUser?.uid)))
            .then((res)=>{
              res.docs.forEach((doc)=>{
                  list.push(doc.data())
              })
              setFollowers(list)
              setLoad(false)
            })
            }
        }
      return () => {
        isMounted = false
      };
    }, [currentUser])
    ////////////componenen
 function Follower ({follower}){
    return (
   <Link to={`/${follower?.id}`}  state={{data : follower}} className='text-dark' style={{textDecoration:'none'}} >
    <div className='d-flex mb-3'>
        <div className="profile-img rounded-circle" style={{backgroundImage:`url(${follower?.pdp})`}}></div>
        <p className='mx-2 my-auto '>{follower?.username} </p>
    </div> 
    </Link>
    )
 }

  return (
   <Modal
    show={ShowFollowers}
    onHide={() => setShowFollowers(false)}
    aria-labelledby="contained-modal-title-vcenter"
    centered
  > 
    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-vcenter">
        Followers
      </Modal.Title>
    </Modal.Header>
    <Modal.Body style={{overflowY:'scroll' , maxHeight:'60vh', minHeight:'30vh'}} >
      {!load &&  followers?.map((follower)=>{
        return <Follower follower={follower} />
      })   
      }

     {!load && followers?.length ==0 && 
     <div className="w-100 d-flex bg-wrning " style={{justifyContent:'center',maxHeight:'60vh', minHeight:'30vh' , alignItems:'center'}}>
     <Form.Text>You have no follower :(</Form.Text>
   </div>
     }
      {load && 
      <div className="w-100 d-flex bg-wrning " style={{justifyContent:'center',maxHeight:'60vh', minHeight:'30vh' , alignItems:'center'}}>
        <ClipLoader />
      </div>
      }
    </Modal.Body>
    {/* <Modal.Footer>
      <Button onClick={()=>setShowFollowers(false)}>Close</Button>
    </Modal.Footer> */}
  </Modal>
  )
}

export default FollowersModal