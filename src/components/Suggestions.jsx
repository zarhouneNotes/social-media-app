import React from 'react'
import Suggest from './Suggest'

function Suggestions({list , setShowForm, setShowSuggestions}) {
    function Empty (){
        return (
            <div className="w-100 py-3 border mx-1  bg-white text-center">no user found</div>

        )
    }
  return (
    <div className='suggestions bg-light w-100 pb-2 mt-2 '>
        {list?.length ==0 ?
        <Empty /> :
        list?.map((item)=>{
            return <Suggest setShowForm={setShowForm} setShowSuggestions={setShowSuggestions} key={item.id} item={item} />
        })
        }
    </div>
  )
}

export default Suggestions