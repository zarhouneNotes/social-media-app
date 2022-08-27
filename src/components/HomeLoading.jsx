import React from 'react'
import { BarLoader } from 'react-spinners'
import logo from '../images/logo.png'
function HomeLoading() {
  return (
    <div className='home-loading d-flex' style={{justifyContent:'center' , alignItems:'center' , height:'100vh' , width:'100%'}}>
            <div className="load-con bg-dangr text-center">
                <div className="load-logo">
                    <img src={logo} alt="" srcset="" />
                </div>
                <BarLoader
                color="#59e6ff"
                speedMultiplier={1}
                 />
            </div>
    </div>
  )
}

export default HomeLoading