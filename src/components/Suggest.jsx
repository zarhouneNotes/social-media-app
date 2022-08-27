import React from 'react'
import { Link } from 'react-router-dom'

function Suggest({item,setShowForm , setShowSuggestions}) {
  return (
   <Link  to={`/user=${item?.id}`} state={{data : item}} className='link text-dark'>
    <div onClick={()=>{setShowSuggestions(false) ; setShowForm(false)}} className="m-1 py-2 bg-white borer d-flex">
        <div className='profile-img bg-dark rounded-circle' style={{backgroundImage:`url(${item?.pdp})`}} />
        <small className='my-auto mx-2'>{item?.displayName}</small>
    </div>
   </Link>

  )
}

export default Suggest