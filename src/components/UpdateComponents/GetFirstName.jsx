import React, { useEffect, useState } from 'react'
import { Button, Form, FormGroup } from 'react-bootstrap'


function GetFirstName({value , setStatus , setFirstName }) {

  
    const [err , setErr] = useState(false)
 
    

const submitHandel = ()=>{
      if (!value) {
        setErr(true)
      }else{
        setErr(false)
        setStatus(2)
      }
    }
    return (
        
        <Form className='update-inputs  ' >
           <FormGroup className="mb-3 w-100"  >
                <Form.Label  className='fs-5 text-secondary'   >First name <span className='text-danger' >*</span> </Form.Label>
                <Form.Control placeholder='First Name..' type='text' defaultValue={value}  size="" className='text-field'  onChange={(e)=>{setFirstName(e.target.value)}}/>
                { err && <Form.Text className='text-danger'  >required</Form.Text>}
           </FormGroup>
           <div className="btn-sec text-center quest-btns">
                {/* <Button  variant='outline-primary' className='rounded-pill up-btn w-25 ' size="lg"   >Back</Button> */}
                <Button  variant='primary' className='rounded-pill up-btn w-25 ' size="" onClick={submitHandel}   >Next</Button>
           </div>
        </Form>
    )
}

export default GetFirstName