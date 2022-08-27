import React, { useState } from 'react'
import { Button, Form, FormGroup } from 'react-bootstrap'

function GetPhotoURL({value , setStatus , setPhotoURL , updateHandl}) {
  const [err , setErr] = useState(false)
  // const submitHandel = (e)=>{
  //   if (!value) {
  //     setErr(true)
  //   }else{
  //     setErr(false)
  //     updateHandl(e)
  //   }
  // }
  return (
    <Form className='update-inputs' >
        <FormGroup className="mb-3"  >
            <Form.Label className='fs-5 text-secondary'  >Profile picture  <span className='text-danger' >*</span> </Form.Label>
            <Form.Control placeholder='paste your photo URL' type='text' defaultValue={value}  size="" className='text-field' onChange={(e)=>{setPhotoURL(e.target.value)}} required />
           { err && <Form.Text className='text-danger'  >required</Form.Text>}
        </FormGroup>
        <div className="btn-sec text-center  quest-btns ">
                            <Button  variant='outline-primary' className='rounded-pill up-btn w-25 ' size="" onClick={()=>{setStatus(5)}}   >Back</Button>
                            <Button  variant='primary' className='rounded-pill up-btn w-25 ' size="" onClick={updateHandl}   >Save</Button>
        </div>
    </Form>
  )
}

export default GetPhotoURL