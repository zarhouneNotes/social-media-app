import React, { useState } from 'react'
import { Form, InputGroup , Button , Alert} from 'react-bootstrap'
import { Link , useNavigate } from 'react-router-dom'
import {FaLock} from 'react-icons/fa'
import {BsGoogle , BsHeart} from 'react-icons/bs'
import { db, login , LogInWithGoogle, useAuth } from './Firebase'
import {ReactComponent as Logo} from '../images/logo.svg'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import logo from '../images/logo.png'


function Login() {
    const [Err , setErr] = useState('')
    const [email , setEmail] = useState('')
    const [mdp , setMdp] = useState('')
    const navigate= useNavigate()
    const currentUser = useAuth()



    ///// if user logged redirect

    if (currentUser) {
        navigate('/')
    }

    

    /////login with email and password
    function loginWithEmailAndPasswordHandl  (e){
        e.preventDefault()

        login(email , mdp)
        .then((res)=>{
            setErr('')
            
            localStorage.setItem("auth", 'true')
            updateDoc(doc(db , 'users' , currentUser?.uid),{
              isOnline : true
            } )
            

        })
        .catch((error)=>{
            setErr(error.message)
        })
    }

    ///////:login with gooogl

    const GoWithGoogle = () =>{
      LogInWithGoogle().then((res)=>{
        
        localStorage.setItem("auth", 'true')
        // console.log(res.user)
        
         getDoc(doc(db , "users" , res.user?.uid))
        .then((userInfo)=>{
         const response =  userInfo.data() 
         if (!response) {
          setDoc(doc(db , 'users', res.user?.uid ),{
            id : res.user?.uid ,
            bio : "" ,
            coverPhoto : 'https://static.vecteezy.com/system/resources/thumbnails/005/169/172/small/banner-abstract-geometric-white-and-gray-color-background-illustration-free-vector.jpg',
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
       
       
      }).catch((error)=>{
        setErr(error.message)
        // console.log(error.message)
      })

    }

    ////////////

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
          <Form.Text>Let's seil together <BsHeart />  </Form.Text>
          
          <div className='text-center mb-3' >
           {/* <Logo  width='100px' /> */}
           <img src={logo} alt="" srcset="" width='100px'/>
           {/* <h3 className=' logo' >Seabed</h3> */}
          </div>
          { Err &&  <Alert variant='danger' >{rebuiltError(Err)}</Alert>}
         <Form.Control
                   
                    className='text-field py-2 mb-3 px-3 rounded-pill '
                    placeholder="Email.."
                    type='email'
                    onChange={(e)=>{setEmail(e.target.value)}}
                    />
        <Form.Control

                        onChange={(e)=>{setMdp(e.target.value)}}
                        className='text-field py-2 mb-3 px-3 rounded-pill'
                        type='password'
                        placeholder="Password.."
                        />
            
            <Button onClick={loginWithEmailAndPasswordHandl} variant='info' className='w-100 rounded-pill p-2 ' >Log In</Button>
            <div className="text-center or">
                <div className="line bg-secondary">.</div>
                <small className='m-2'>Or</small>
                <div className="line bg-secondary">.</div>
            </div>
            <Button className=' w-100 rounded-pill p-2' variant='outline-dark' size='' onClick={GoWithGoogle}  ><BsGoogle /> Log In with Google</Button>
          
         
            <Form.Text>Need an account ? <Link to='/signup' >Sign up</Link> </Form.Text>
        </Form>

    </div>
  )
}

export default Login