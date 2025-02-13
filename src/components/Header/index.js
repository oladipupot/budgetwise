import React, { useEffect } from 'react'
import "./styles.css"
import { auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import {  signOut } from "firebase/auth";
import { toast } from 'react-toastify';
import userImg from "../../assets/user.svg"


function Header() {

  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

    useEffect(() => {
      if(user){
        navigate("/dashboard")
      }
    }, [user, loading])
    
    function logoutFnc(){
        try {
          signOut(auth).then(() => {
            // Sign-out successful.
            toast.success("logged out successfully")
            navigate("/")
          }).catch((error) => {
            toast.error(error.message)
            // An error happened.
          });
        }catch(e){
          toast.error(e.message)
        }
    }
  return (
    <div className='navbar'>
        <p className='logo'>Budget Wise</p>
        {user && 
        <div style={{display:"flex", alignItems:"center", gap:"0.5rem"}}>
          <img 
            src={user.photoURL ? user.photoURL :userImg} 
            style={{borderRadius:"50%", height:"2rem", width:"2rem"}} 
            
          />
          <p onClick={logoutFnc} className='logo link'>Logout</p>
        </div>
        }
        
    </div>
  )
}

export default Header