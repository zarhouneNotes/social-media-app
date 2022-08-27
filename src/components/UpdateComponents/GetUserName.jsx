import React, { useState } from 'react'
import { Button, Form, FormGroup } from 'react-bootstrap'



function GetUserName({value , setStatus , setUsername}) {
    const [err , setErr] = useState(false)
    const submitHandel = ()=>{
      if (!value) {
        setErr(true)
      }else{
        setErr(false)
        setStatus(4)
      }
    }
    return (
        
        <Form className='update-inputs' >
           <FormGroup className="mb-3"  >
           <Form.Label className='fs-5 text-secondary' >username <span className='text-danger' >*</span> </Form.Label>
                <Form.Control placeholder='username..' defaultValue={value}  type='text'  size="" className='text-field' onChange={(e)=>{setUsername(e.target.value)}}  />
                { err && <Form.Text className='text-danger'  >required</Form.Text>}
           </FormGroup>
           <div className="btn-sec text-center  quest-btns ">
                                 <Button  variant='outline-primary' className='rounded-pill up-btn w-25 ' size="" onClick={()=>{setStatus(2)}}   >Back</Button>
                                 <Button  variant='primary' className='rounded-pill up-btn w-25 ' size="" onClick={submitHandel}   >Next</Button>
             </div>
        </Form>
    )
}

export default GetUserName