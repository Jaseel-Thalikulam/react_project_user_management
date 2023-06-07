import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from "react-toastify";
import './addUser.css'
import { useCookies } from 'react-cookie';
function AddUser() {
    const [value,setValue] = useState({
        email:'',
        phone:'',
        password:''
    })
    const [cookies, setCookie, removeCookie] = useCookies([])
    const navigate = useNavigate()
    const generateError = (err) => toast.error(err,{
        position:'bottom-right'
    })
    const handlesubmit = async (e)=>{
        e.preventDefault()
        try {
          
            
         const {data} = await axios.post('http://localhost:4000/register',{
             ...value
         },
         {withCredentials: true})

        
         if(data.errors){
      
           const {email,password,phone} =  data.errors
           if(email){ 
         
            generateError(email)}
           else if (phone){ 
       
            generateError(phone)}
           else if (password){
           
             generateError(password)}
           else{
           }
         }else{
           
            setValue({
                email:'',
                phone:'',
                password:''
            })
            toast.success('created user', {
                position: "top-center",
              });
         }

        } catch (error) {
         console.log(error.message);
        }
         }
  return (
    <>
      
      <div className="header">

     <span className='adminHomes' onClick={()=>{
       navigate('/admin')
      }}>Go Back</span>

     <button id='logouts' onClick={() => {
       removeCookie('jwtadmin')
       navigate('/login')
      }}>Log out</button>
      </div>

    <div className='addUser'>
     
      <form  onSubmit={(e)=>{
   handlesubmit(e)
      }} >
        <h2>Add User</h2>
        <label htmlFor="">Name</label>
        <input 
            onChange={(e)=>{
            setValue({...value,[e.target.name]:e.target.value})
            }} value={value.firstname} type="text" name='firstname' /> <br />
          
             
          <label htmlFor="">Email</label>
        <input 
            onChange={(e)=>{
            setValue({...value,[e.target.name]:e.target.value})
            }} value={value.email} type="email" name='email' /> <br />
        
          
          <label htmlFor="">Phone</label>
        <input 
            onChange={(e)=>{
            setValue({...value,[e.target.name]:e.target.value})
            }} value={value.phone} type="text" name='phone' />  <br />
      
      
          <label htmlFor="">Password</label>
        <input 
            onChange={(e)=>{
            setValue({...value,[e.target.name]:e.target.value})
            }} value={value.password} type="password" name='password' /> <br />
   
    <div className='sub-btn'>  <button type='submit'>Create</button> </div>
      </form>
      <ToastContainer/>
    </div>
    </>
  )
}

export default AddUser
