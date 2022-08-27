import React from 'react'
import {AiFillHome} from 'react-icons/ai'
import {  TbLetterL , TbLetterB  , TbLetterU} from 'react-icons/tb'
import {MdWork} from 'react-icons/md'
import {BsFillCheckCircleFill} from 'react-icons/bs'

function Map({status}) {
  return (
    <div className='map'  > 
        <div className={`dwara ${status >= 1 ? 'bule-icon-map ' : 'bg-secondary' } `}> <AiFillHome fontSize='20px' className='map-icon'   />  </div>
        <div className="triq">
            <div className={`l3mara ${status >=2? 'move' : ''  }  `}>

            </div>
        </div>
        {/* bule-icon-map */}
        <div className={`dwara ${status >= 2 ? 'bule-icon-map ' : 'bg-secondary' } `}> <TbLetterL fontSize='20px' className='map-icon'  />  </div>
        <div className="triq">
            <div className={`l3mara ${status >= 3? 'move' : ''  }  `}>

            </div>
        </div>

        <div className={`dwara ${status >= 3 ? 'bule-icon-map ' : 'bg-secondary' } `}> <TbLetterU fontSize='20px' className='map-icon'  />  </div>
        <div className="triq">
            <div className={`l3mara ${status >= 4? 'move' : ''  }  `}>

            </div>
        </div>

        <div className={`dwara ${status >= 4 ? 'bule-icon-map ' : 'bg-secondary' } `}> <TbLetterB fontSize='20px' className='map-icon'  />  </div>
        <div className="triq">
            <div className={`l3mara ${status >= 5? 'move' : ''  }  `}>

            </div>
        </div>

        <div className={`dwara ${status >= 5 ? 'bule-icon-map ' : 'bg-secondary' } `}> <MdWork fontSize='20px' className='map-icon'  />  </div>
        <div className="triq">
            <div className={`l3mara ${status == 6? 'move' : ''  }  `}>

            </div>
        </div>

        <div className={`dwara ${status >= 6 ? 'bule-icon-map bg-success' : 'bg-secondary' } `}> <BsFillCheckCircleFill fontSize='20px' className='map-icon'   />  </div>
        
    </div>
  )
}

export default Map