import React, { useState } from 'react'
import { Button, Form, FormGroup } from 'react-bootstrap'

function GetBio({value , setStatus , setBio}) {
    const [err , setErr] = useState(false)
    const submitHandel = ()=>{
      if (!value) {
        setErr(true)
      }else{
        setErr(false)
        setStatus(5)
      }
    }
    return (
        
        <Form className='update-inputs' >
           <FormGroup className="mb-3"  >
           <Form.Label className='fs-5 text-secondary' >  Bio <span className='text-danger' >*</span> </Form.Label>
                <Form.Control placeholder='you can write anything..' type='text'  size="" className='text-field' defaultValue={value} onChange={(e)=>{setBio(e.target.value)}}  />
                { err && <Form.Text className='text-danger'  >required</Form.Text>}

           </FormGroup>
           <div className="btn-sec text-center  quest-btns ">
                                 <Button  variant='outline-primary' className='rounded-pill up-btn w-25 ' size="" onClick={()=>{setStatus(3)}}   >Back</Button>
                                 <Button  variant='primary' className='rounded-pill up-btn w-25 ' size="" onClick={submitHandel}   >Next</Button>
             </div>
           
       </Form>
    )
}

export default GetBio