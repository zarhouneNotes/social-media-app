import React from 'react'
import { useLocation } from 'react-router-dom'
import FriendHero from './FriendHero'
import OtherPosts from './OtherPosts'

function OtherWall() {
    const location= useLocation()
    const data = location.state?.data
  return (

    <div className='col-lg-6 col-sm-12 mx-auto' style={{minHeight: '100vh'}} >
        <FriendHero data={data} />
        <OtherPosts data={data} />
    </div>
   
  )
}

export default OtherWall