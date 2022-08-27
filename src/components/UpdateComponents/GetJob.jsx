import React, { useState } from 'react'
import { Button, Form, FormGroup } from 'react-bootstrap'

function GetJob({value , setStatus , setJob}) {
    const [err , setErr] = useState(false)
    const submitHandel = ()=>{
      if (!value) {
        setErr(true)
      }else{
        setErr(false)
        setStatus(6)
      }
    }
    return (
        
        <Form className='update-inputs' >
           <FormGroup className="mb-3"  >
           <Form.Label className='fs-5 text-secondary' >Job or Social status <span className='text-danger' >*</span> </Form.Label>
                <Form.Control placeholder='what do you do in real life..' type='text' defaultValue={value}  size="" className='text-field'  onChange={(e)=>{setJob(e.target.value)}}   />
                { err && <Form.Text className='text-danger'  >required</Form.Text>}

           </FormGroup>
           <div className="btn-sec text-center  quest-btns ">
                                 <Button  variant='outline-primary' className='rounded-pill up-btn w-25 ' size="" onClick={()=>{setStatus(4)}}   >Back</Button>
                                 <Button  variant='primary' className='rounded-pill up-btn w-25 ' size="" onClick={submitHandel}   >next</Button>
             </div>
       </Form>
    )
}

export default GetJob