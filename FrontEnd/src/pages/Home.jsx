import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import '../pages/home.css'
import { useDispatch, useSelector } from 'react-redux'
import { setUserDetails } from '../redux/userSlice'


function Home() {
  const user = useSelector((state) => state.user);
  const [cookies, setCookie, removeCookie] = useCookies([])
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(() => {
    const veryfyUser = async () => {
      if (!cookies.jwt && !cookies.jwtadmin) {
        navigate('/login')
      } else {
        

        const { data } = await axios.post('http://localhost:4000', { user: user }, { withCredentials: true })
       


        if (!data.status && !data.isAdmin ) {

          if (cookies.jwt) {
            removeCookie('jwt')   
          }

          if (cookies.jwtadmin) {
            removeCookie('jwtadmin')
          }

          navigate('/login')
          
        } else {
          if (!data.user && data.isAdmin) {
            navigate('/admin')
          } else {
            
              dispatch(
                setUserDetails({
                  id: data.user._id,
                  firstname: data.user.firstname,
                  email: data.user.email,
                  phone: data.user.phone,
                  image: data.user.image
                })
              )
            

          }

        }
      }
    }
    veryfyUser()
  }, [cookies, navigate, removeCookie])


  return (
    <>
      <div>
        <div className='header'>
          <img onClick={() => {
            navigate('/profile')
          }} className='profile' src={user.image ? process.env.PUBLIC_URL + `/image/${user.image}` : "https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg"} alt="" />
          <h1 id='homeHead'>Welcome, {user.firstname}</h1>
       
      <button id='logout' onClick={() => {
        removeCookie('jwt')
        navigate('/login')
      }}>Log out</button>
        </div>
      </div>

     

    </>

    

  )
}

export default Home
