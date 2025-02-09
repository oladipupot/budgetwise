import React, { useState } from 'react'
import "./style.css"
import Input from '../input'
import Button from '../Button';
import { auth, db } from "../../firebase"
import { doc, setDoc} from "firebase/firestore";
import { getDoc } from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom"

function SignupSigninComponent() {
    const [name, setName] =useState("");
    const [email, setEmail] =useState("");
    const [password, setPassword] =useState("");
    const [confirmPassword, setConfirmPassword] =useState("");
    const [loginForm, setLoginForm] =useState(false);
    const [loading, setLoading] =useState(false);
    const navigate = useNavigate();
    const provider = new GoogleAuthProvider();


    function signupWithEmail () {
      setLoading(true)
    
      console.log("Name", name);
      console.log("Email", email);
      console.log("Passw0rd", password);
      console.log("confirmpassword", confirmPassword);

      // Authenticate the user, or basically create anew account using email and password
      if (name!=="" && email!=="" && password!=="" && confirmPassword!=="") {
        if (password===confirmPassword) {
          createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
          // Signed up 
          const user = userCredential.user;
          console.log("user>>>", user);
          toast.success("User Created!");
          setLoading(false);
          setName("");
          setPassword("");
          setEmail("");
          setConfirmPassword("");
          createDoc(user);
          navigate("/dashboard")
          //  create a doc with user id as the following id
          })
          
          .catch((error) => {
            // const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage)
            setLoading(false);
            // ..
          });
        } else {
          toast.error("password and confirm password dont't match")
          setLoading(false);
        }
        
      } else {
          toast.error("All fields are required")
          setLoading(false);
      }
    
    }

    function loginUsingEmail(){
      console.log("email",email);
      console.log("password", password);
      setLoading(true);
      if (email!=="" && password!=="") {
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          toast.success("User logged in!")
          console.log("user logged in", user)
          setLoading(false);
          // ...
        })
        .catch((error) => {
          // const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage)
          setLoading(false);
        });
      } else {
        toast.error("All fields are Mandatory")
        setLoading(false);
      }
     
    }

    async function createDoc(user){
      //  make sure that the doc with the uid doesnt exist
      // create a doc.
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const userData = await getDoc(userRef);
  
      if (!userData.exists()) {
        try {
          await setDoc(doc(db, "users", user.uid), {
            name: user.displayName ? user.displayName : name,
            email: user.email,
            photoURL: user.photoURL ? user.photoURL : "",
            createdAt: new Date(),
          });
          toast.success("Doc created!");
        }
        catch(e){
          toast.error(e.message);
          setLoading(false);
        }
      } else{
        // toast.error("Doc already exists");
        setLoading(false);
      }
     
    }

    function googleAuth(){
      setLoading(true)
      try {
        signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          console.log("user>>>", user );
          createDoc(user);
          setLoading(false);
          navigate("/dashboard")
          toast.success("user authenticated");
          // IdP data available using getAdditionalUserInfo(result)
          // ...
        }).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.success(errorMessage);
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
      } catch(e){
        toast.error(e.message)
        setLoading(false);
      }
    }

  return (
    <>
    {loginForm ? 
    (
      <div className='signup-wrapper'>
        <h2 className='title'>
            Login on <span style={{ color: "var(--theme)" }}>BudgetWise</span>
        </h2>
        <form>
            <Input 
              type="email" 
              label={"Email"} 
              state={email} 
              setState={setEmail} 
              placeholder={"Enter your email"} 
            />
            <Input 
              type="password" 
              label={"Password"} 
              state={password} 
              setState={setPassword} 
              placeholder={"Enter password"} 
            />
            <Button 
              disabled={loading} 
              text={loading ? "Loading..." :"Login Using Email And Password"} 
              onClick={loginUsingEmail}
            />
            <p className='p-login'>Or</p>
            <Button 
              onClick={googleAuth}
              text={loading ? "Loading..." :"Login Using Google"} 
              blue={true}
            />
            <p className='p-login' style={{ cursor: "pointer" }} onClick={()=> setLoginForm(!loginForm)}>or Dont Have an Account? Click Here </p>
        </form>
      </div>
    ): (
      <div className='signup-wrapper'>
        <h2 className='title'>
            Sign up on <span style={{ color: "var(--theme)" }}>BudgetWise</span>
        </h2>
        <form>
            <Input 
              type="name" 
              label={"Full Name"} 
              state={name} setState={setName} 
              placeholder={"Enter your name"} 
            />
            <Input 
              type="email" 
              label={"Email"} 
              state={email} 
              setState={setEmail} 
              placeholder={"Enter your email"} 
            />
            <Input 
              type="password" 
              label={"Password"} 
              state={password} 
              setState={setPassword} 
              placeholder={"Enter password"} 
            />
            <Input 
              type="password" 
              label={"Confirm Password"} 
              state={confirmPassword} 
              setState={setConfirmPassword} 
              placeholder={"Confirm Password"} 
            />
            <Button disabled={loading} text={loading ? "Loading..." :"Signup Using Email And Password"} onClick={() => signupWithEmail()}/>
            <p className='p-login'>Or</p>
            <Button 
             onClick={googleAuth} 
              text={loading ? "Loading..." :"Signup Using Google"} 
            />
              <p className='p-login' style={{ cursor: "pointer" }} onClick={()=> setLoginForm(!loginForm)}>or Have an Account Already? Click Here </p>
        </form>
      </div>
  )
    }
    
    </>
  )
}

export default SignupSigninComponent