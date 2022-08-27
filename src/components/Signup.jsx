import React, { useState } from 'react'
import { Form, InputGroup , Button , Alert} from 'react-bootstrap'
import { Link , useNavigate } from 'react-router-dom'
import {FaLock} from 'react-icons/fa'
import {BsGoogle , BsFacebook} from 'react-icons/bs'
import { db, login, LogInWithGoogle, Sign_up , useAuth } from './Firebase'
import { doc, setDoc , getDoc } from 'firebase/firestore'
import logo from '../images/logo.png'

function Signup() {
    const navigate= useNavigate()
    const [Err , setErr] = useState('')
    const [email , setEmail] = useState('')
    const [mdpOne , setMdpOne] = useState('')
    const [mdpTwo , setMdpTwo] = useState('')
    const currentUser =useAuth()

 ////////////////////////////////////////////////////////////go with google
    const GoWithGoogle = () =>{
      LogInWithGoogle().then((res)=>{
        // console.log(res.user)
        
         getDoc(doc(db , "users" , res.user?.uid))
        .then((userInfo)=>{
         const response =  userInfo.data() 
         if (!response) {
          setDoc(doc(db , 'users', res.user?.uid ),{
            id : res.user?.uid ,
            bio : "" ,
            coverPhoto : "https://staticg.sportskeeda.com/editor/2022/06/fce50-16558989294307.png",
            email : res.user?.email,
            firstName : "",
            followers : [],
            following : [],
            isOnline : true,
            isProfileCompleted :  false,
            lastName : "",
            lastSeen : res.user?.metadata?.lastSignInTime,
            myPosts : [],
            num_posts : 0,
            pdp : res.user?.photoURL,
            username : "" 
            
          }
          
          )

         }
         navigate('/')
          
        })
        .catch((error)=>{
          setErr(error.message)
        })
      })
    }


///////////////////////////////////////////////////////////// sign up
  const SignUp = (e) =>{
    if (mdpOne === mdpTwo) {
      e.preventDefault()
      Sign_up(email , mdpOne  ).then(()=>{
        
        login(email , mdpOne).then((res)=>{
          // console.log(res.user)
             localStorage.setItem("auth", 'true')
             setDoc(doc(db , 'users', res.user?.uid ),{
              id : res.user?.uid ,
              bio : "" ,
              coverPhoto : "https://static.vecteezy.com/system/resources/thumbnails/005/169/172/small/banner-abstract-geometric-white-and-gray-color-background-illustration-free-vector.jpg",
              email : res.user?.email,
              firstName : "",
              followers : [],
              following : [],
              isOnline : true,
              isProfileCompleted :  false,
              lastName : "",
              lastSeen : res.user?.metadata?.lastSignInTime,
              myPosts : [],
              num_posts : 0,
              pdp : "https://cdn-icons-png.flaticon.com/512/149/149071.png",
              username : "" 
              
            }
            
            )
            .then(()=>{
              navigate('/')
            })
       
            // console.log(res.user)
        })
      })
      .catch((error)=>{
        setErr(error.message)
      })
      
    } else {
      setErr('Firebase: Password does not match.')
    }
 
  }

//////////////////////////////////////////////////////////////// error
    function rebuiltError (Test){
        var fixedTest = ''
          for (let index = 0; index < Test.length; index++) {
            if (Test[index] === '-') {
              fixedTest = fixedTest + ' '
            }
            else{
              fixedTest = fixedTest + Test[index]
            }
          }
    
          return fixedTest.slice(10).replace('Error' , '').replace('(auth/' , '').replace(')' , '')
    

      }
  return (
    <div className='bg- myform-container' >
    <Form className='myform'  >
    <h5 className=' my-1' >Sign up</h5>
      <div className="text-center">
      <img src={logo} alt="" srcset="" width='100px'/>
      </div>
      
      
      { Err &&  <Alert variant='danger' >{rebuiltError(Err)}</Alert>}
          <Form.Control
                className='text-field mb-3 py-2 px-3 rounded-pill'
                value={email}
              
                placeholder="Email.."
                type='email'
                onChange={(e)=>{setEmail(e.target.value)}}
                />
   
            <Form.Control
                    value={mdpOne}
                    onChange={(e)=>{setMdpOne(e.target.value)}}
                    className='text-field mb-3 py-2 px-3 rounded-pill'
                    type='password'
                    placeholder="Password.."
                    />
     
          <Form.Control
                    value={mdpTwo}
                    onChange={(e)=>{setMdpTwo(e.target.value)}}
                    className='text-field mb-3 py-2 px-3 rounded-pill'
                    type='password'
                    placeholder="Password.."

                    />
        
        <Button size=''  variant='info' className='w-100 btn p-2 text-light rounded-pill'  onClick={SignUp}  >Sign up</Button>
        <div className="text-center or">
            <div className="line bg-secondary">.</div>
            <small className='m-2'>Or</small>
            <div className="line bg-secondary">.</div>
        </div>
        <Button size='' className='w-100  p-2 rounded-pill' variant='outline-dark'  onClick={GoWithGoogle} ><BsGoogle size={20} /> Continue with Google</Button>
    
     
        <Form.Text>already have an account ? <Link to='/login' >Log In</Link> </Form.Text>
    </Form>

</div>
  )
}

export default Signup