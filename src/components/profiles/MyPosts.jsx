import React, { useEffect, useState, } from 'react'
import { collection, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { db, useAuth } from '../Firebase'
import Post from './Post'
import { Alert } from 'react-bootstrap'
import { ClipLoader } from 'react-spinners'

function MyPosts({username , firstName , lastName , url }) {
  const currentUser = useAuth()
  const [posts , setPosts] = useState([]) 
  const [load , setLoad] = useState(null) 
  // console.log(posts?.length)

  useEffect(() => {
    setLoad(true)
     if (currentUser) {
        const Data = []
        getDocs(query(collection(db , 'posts') , where("authorId" , "==" , currentUser?.uid ) , orderBy('time' ) ))
        .then((res)=>{
          res.forEach((doc)=>{   Data.push(doc.data())   })
           setPosts(Data.reverse()) 
          //  console.log(posts)
          setLoad(false)
        })
      }
  
  },[currentUser])   
  return load ? 
          [1 , 2 ].map((post)=>{
            return <div key={post} className="w-100   bg-light text-center text-info bg-   border   "style={{borderRadius:'1em' , padding:'3cm 0px' , marginTop:'0.5cm'  }} >
                    <ClipLoader color='#5bc0de' />
                  </div>
          })
       
:  (
   <div className="posts ">
    {
         <div className="posts ">
          {  posts?.map((post)=>{
              return <Post  post={post} url={url}  username={username} firstName={firstName} lastName={lastName} key={post.id}/> 
            })
          }
        </div>
        } 

    </div>
  )
}

export default MyPosts