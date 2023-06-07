import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Admin/User.css';
import {useCookies} from 'react-cookie'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";



function Users() {
  const [value, setEdit] = useState({
    firstname: '',
    email: '',
    phone: '',
    id: ''
  })
  const [cookies, setCookie, removeCookie] = useCookies([])
  const navigate = useNavigate()
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {


    const veryfyUser = () => {

      if (!cookies.jwtadmin) {

        navigate('/login')
      } else {


        axios.get('http://localhost:4000/admin', {withCredentials:true})
          .then((result) => {

            if (!result.status) {

              removeCookie('jwtadmin')
              navigate('/login')
            } else {

              setUsers(result.data.data);
            }

          }

          );
      }
    }
    veryfyUser()



  }, [cookies, navigate, removeCookie, value]);

  const handleSubmit = (e) => {
    e.preventDefault()

    axios.post('http://localhost:4000/edit-user', {
      ...value
    },{withCredentials:true}).then((response) => {

      if (response.data.status) {

        toast.success(response.data.message, {
          position: "top-center",
        })
        setEdit({
          email: '',
          email: '',
          id: ''

        })
      } else {
        toast.error(response.data.message, {
          position: "top-center",
        })
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  function deleteUser(id) {

    axios.delete(`http://localhost:4000/admin/delete-user/${id}`, {
      withCredentials: true,
    }).then((response) => {
      if (response.data.status) {
       
        toast.success(response.data.message, {
          position: "top-center",
        });
        getUserList();
      } else {
        toast.error(response.data.message, {
          position: "top-center",
        });
      }
    });
  }

  const getUserList = () => {

    axios.get('http://localhost:4000/admin', {withCredentials:true})
      .then((result) => {
        setUsers(result.data.data);
      })
  }
  const handleChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };
  const filteredUsers = users?.filter((user) => {
    const searchWords = searchQuery.split(' ');
    for (let i = 0; i < searchWords.length; i++) {
      if (
        !Object.values(user)
          .join(' ')
          .toLowerCase()
          .includes(searchWords[i])
      ) {
        return false;
      }
    }
    return true;
  });

  return (
    <>
      <div className="header">
        <h1>Welcome, Admin</h1>
        <button id="logouts" onClick={() => {
          removeCookie('jwtadmin');
          navigate('/login');
        }}>Log out</button>
      </div>
      <div className='test'>
        <button id='addUser' onClick={() => {
          navigate('/add-user')
        }}>Add user</button>
        {value.email || value.password || value.id || value.firstname ? <span className='adminHome' onClick={() => {
          setEdit({
            firstname: '',
            email: '',
            password: '',
            id: ''
          })
        }}>Home</span> : null}
        {value.email || value.password || value.id || value.firstname ? <div className='addUser'>
          <form onSubmit={(e) => {
            handleSubmit(e)
          }} >
            <span onClick={() => {
              setEdit({
                email: '',
                password: '',
                id: ''
              })
            }} id='close'>X</span>
            <h2>Edit User</h2>

            <label htmlFor="">Name</label>

            <input
              onChange={(e) => {
                setEdit({
                  [e.target.name]: e.target.value,
                  phone: value.phone,
                  email: value.email,
                  id: value.id
                })
              }} value={value.firstname} type="text" name='firstname' /> <br />


            <label htmlFor="">email</label>

            <input
              onChange={(e) => {
                setEdit({
                  [e.target.name]: e.target.value,
                  phone: value.phone,
                  firstname: value.firstname,
                  id: value.id
                })
              }} value={value.email} type="email" name='email' /> <br />

            <label htmlFor="">Phone</label>
            <input
              onChange={(e) => {
                setEdit({
                  [e.target.name]: e.target.value,
                  email: value.email,
                  firstname: value.firstname,
                  id: value.id
                })
              }} value={value.phone} type="text" name='phone' />  <br />


            <div className='sub-btn'>  <button type='submit'>Save</button> </div>
          </form>
          <ToastContainer />
        </div> :


          <div class="table-container">
            {value.email || value.password || value.id || value.firstname ? null : <input type="text" onChange={handleChange} placeholder='Search..' />}
            <table className='table'>
              <thead>
                <tr>
                  <th>id</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers?.map((user, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{user.firstname}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>

                    <td><button className='editUser' onClick={() => {
                      setEdit({
                        firstname: user.firstname,
                        email: user.email,
                        firstname: user.firstname,
                        phone: user.phone,
                        id: user._id
                      })
                    }} >Edit</button> <button className='userDelete' onClick={() => {
                      deleteUser(user._id)
                    }}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
        <ToastContainer />
      </div>
    </>
  );
}

export default Users;
