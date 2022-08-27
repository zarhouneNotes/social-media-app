import React, { useEffect, useState, } from 'react'
import { collection, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { db, useAuth } from '../Firebase'
import {useLocation, useParams} from 'react-router-dom'
import OtherWallPost from '../OtherWallPost'
import { ClipLoader } from 'react-spinners'

function OtherPosts() {
    const params = useParams()
    const currentUser = useAuth()
    const [posts , setPosts] = useState([]) 
    const [load , setLoad] = useState(null) 
    const location= useLocation()
    const data = location.state.data
    

  
  
    useEffect(() => {
      let isApiSubscribed = true ;
      setLoad(true)
       if (data) {
          const Data = []
          onSnapshot(query(collection(db , 'posts') , where("authorId" , "==" , data?.id )  ) , (res)=>{
             if (isApiSubscribed) {
            res.forEach((doc)=>{   Data.push(doc.data()) 
              
            })
              setPosts(Data) 
              setLoad(false)
          
              // console.log(Data)
             
            }
             
          })
        }

        
      return () => {
        // cancel the subscription
        isApiSubscribed = false;
    };
    // console.log(data)
    
    },[data])   
  return load ? 
        [1 , 2 ].map((post)=>{
            return <div key={post?.id} className="w-100   bg-light text-center text-info bg-   border   "style={{borderRadius:'1em' , padding:'3cm 0px' , marginTop:'0.5cm'  }} >
                    <ClipLoader color='#5bc0de' />
                </div>
        }): (

    <div>
       {posts?.map((post)=>{
        return   <OtherWallPost key={post?.id} data={data} postDetails={post}/>
       })}
    </div>
  )
}

export default OtherPosts