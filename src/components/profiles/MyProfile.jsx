import React ,{useState , useEffect} from 'react'
import { doc, getDoc ,getDocs } from 'firebase/firestore'
import { collection, orderBy, query, where } from 'firebase/firestore'
import { db, useAuth } from '../Firebase'
import MyProfileHero from './MyProfileHero'
import WhatIsInYourMind from './WhatIsInYourMind'
import MyPosts from './MyPosts'
import Post from './Post'
import { Alert , Button} from 'react-bootstrap'
import { async } from '@firebase/util'

function MyProfile() {

    const currentUser = useAuth()
    const [coverURL , setCoverURL ] = useState('')
    const [photoUrl, setPhotoUrl] = useState('')
    const [username , setUsername] = useState('')
    const [firstName , setFirstName] = useState('')
    const [lastName , setLastName] = useState('')
    const [followers, setFollowers] = useState([])
    const [following, setFollowing] = useState([])
    const [numOfPosts, setNumOfPosts] = useState(0)
    const [bio , setBio] = useState('')
    const [job , setJob] = useState('')

    /////////////// posts  
  
    const [load , setLoad] = useState(null)  
    // const [posts , setPosts] = useState([])  

  

///////info
    useEffect(() => {
        if (currentUser) {
            setLoad(true)
            getDoc(doc(db , 'users' , currentUser.uid))
            .then((res)=>{
                // console.log(res.data())
                const response = res.data()
                setJob(response.job)
                setCoverURL(response.coverPhoto)
                setPhotoUrl(response.pdp)
                setFirstName(response.firstName)
                setLastName(response.lastName)
                setUsername(response.username)
                setFollowers(response.followers)
                setFollowing(response.following)
                setNumOfPosts(response.num_posts)
                setBio(response.bio)
                setLoad(false)
            })

            
        }
        
      
    }, [currentUser])


  
  return    (
    <div className='col-md-6 col-sm-12 bg- mx-auto'  style={{minHeight: '100vh'}} >
        <MyProfileHero  load={load}  setCoverURL={setCoverURL} setPhotoUrl={setPhotoUrl} coverURL={coverURL} photoUrl={photoUrl} numOfPosts={numOfPosts} username={username}  firstName={firstName} lastName={lastName} bio={bio} job={job} followers={followers} following={following}     />
        <div style={{marginTop:'-9vh'}} >
        <WhatIsInYourMind load={load} setNumOfPosts={setNumOfPosts} numOfPosts={numOfPosts}  url={photoUrl}  username={username}   />
        </div>
        <MyPosts url={photoUrl}  username={username} firstName={firstName} lastName={lastName}  />
         
        <div  style={{height:'60vh'}} ></div>
    </div>
  )
}

export default MyProfile