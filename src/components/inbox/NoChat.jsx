import React from 'react'
import npchat from './nochat.png'

function NoChat() {
  return (
    <div className='col-lg-6 bg-warnin h-100 col-sm-12  d-flex ' style={{justifyContent:'center' , alignItems:'center'  }}   >
        <div className="nochat-container mx-auto text-secondary text-center " style={{ borderRadius:'1em' }}>
            <h4>PICK A FRIEND</h4>
            <img className='my-2' width='200px' src={npchat} alt="" srcset="" />
            <h4>TO TALK WITH</h4>
        </div>
    </div>
  )
}

export default NoChat