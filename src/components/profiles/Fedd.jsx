import React, { useEffect, useState, } from 'react'
import { collection, doc, getDocs, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore'
import { db, useAuth } from '../Firebase'
import Post from './Post'
import {useParams} from 'react-router-dom'
import OtherPost from '../OtherPost'
import { ClipLoader } from 'react-spinners'
import { useRef } from 'react'

function Fedd({ }) {
  const currentUser = useAuth()
  const [posts , setPosts] = useState([]) 
  const [load , setLoad] = useState(null) 
  

  

  // useEffect(() => {
  //   if (params) {
  //     return () => {
  //       effect
  //     };
  //   }
  // }, [params])



  useEffect(() => {
    let isApiSubscribed = true 
      setLoad(true)
     if (currentUser) {

        const Data = []
        onSnapshot(query(collection(db , 'posts') ) , (res)=>{
          res.forEach((doc)=>{   Data.push(doc.data())   })
           if (isApiSubscribed) {
            setPosts(Data) 
             setLoad(false)
           }
        })
      }

      return () => {
        // cancel the subscription
        isApiSubscribed = false;
    };
  
  },[currentUser])   
  return load ? 
          [1 , 2 , 3 , 4].map((post)=>{
            return <div key={post} className="w-100   bg-light text-center text-info bg-   border   "style={{borderRadius:'1em' , padding:'3cm 0px' , marginTop:'0.5cm'  }} >
                    <ClipLoader color='#5bc0de' />
                  </div>
          })
               
   :  (
   <div className="posts "  >
    {
         <div className="posts ">
          {  posts?.map((post)=>{
            // updateDoc(doc(db , 'posts' , post.id),{
            //   comments : []
            // })
              return <OtherPost   postDetails={post}  key={post.id}/> 
            })
          }
        </div>
        } 

    </div>
  )
}


export default Fedd