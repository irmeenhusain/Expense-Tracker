import React, { useState } from 'react';
import "./styles.css";
import Input from '../Input';
import Button from '../Button';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast} from 'react-toastify';
import {auth, doc, db, setDoc, provider} from "../../firebase";
import { getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";



function SignupSigninComponent(){
  const [name,setName] =useState("");
  const [email,setEmail] =useState("");
  const [password,setPassword] =useState("");
  const [confirmPassword,setConfirmPassword] =useState("");
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm]= useState(false);
  const navigate= useNavigate();

  function signupWithEmail(){
    setLoading(true);
  //Authenticate the user i.e. create a new account using email
    if(name!="" && email!="" && password!="" && confirmPassword!=""){
      if(password==confirmPassword){
        createUserWithEmailAndPassword(auth, email, password)
       .then((userCredential) => {
          // Signed up 
          const user = userCredential.user;
          console.log("User>>", user);
          toast.success("User Created!")
          // ...
          setLoading(false);
          setName("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          createDoc(user);
          navigate("/dashboard");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage);
          // ..
          setLoading(false);
        });
      }
      else{
        toast.error("Password and Confirm Password don't match");
        setLoading(false);
      }
    }  
    else{
      toast.error("All fields are mandatory!");
      setLoading(false);
   }

  }

  function loginUsingEmail(){
    setLoading(true);
    if(email!="" && password!=""){
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log("user>>", user);
        toast.success("User Logged In!");
        setLoading(false);
        navigate("/dashboard");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setLoading(false);
        toast.error(errorMessage);
      });
    } else {
      toast.error("All fields are mandatory!");
      setLoading(false);
   }
   

  }

async function createDoc(user){
  setLoading(true);

    if(!user)return;
    //first make sure that the doc with the uid dosn't exists
    //get user id
    const userRef = doc(db, "users", user.uid); 
    //get all the data of that user
    const userData =  await getDoc(userRef);
    
    //Create doc
    if(!userData.exists()){
      try{
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayNmae ? user.displayName : name,
          email: user.email,
          photoURL: user.photoURL? user.photoURL : "",
          createdAt: new Date()
        });
        setLoading(false);
      }
      catch(e){
        toast.error(e.message);
        setLoading(false);
      }
    }
    else{
    //  toast.error("doc already")
    setLoading(false);
    }
    

  }
  //login/signup using google
  function googleAuth(){
    setLoading(true);
    try{
      signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        setLoading(false);
        createDoc(user);
        navigate("/dashboard");
        toast.success("User Authenticated!");
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch((error) => {
        setLoading(false);
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage);
  
      });
  
    }catch(e){
      toast.error(e);
    }
  }
  return (
    <> 
    {/* conditionally display the signup page or the login page */}
    {loginForm ? (
      <div className='signup-wrapper'>
      <h2 className='title'>
        Login on<span style={{color:"var(--theme)"}}> Financium</span>
      </h2>
      <form>
        <Input         
         label={"Email"}  
         state={email} 
         setState={setEmail} 
         placeholder={"JohnDoe@gmail.com"} 
       />
        <Input 
         type="password"
         label={"Password"}  
         state={password} 
         setState={setPassword} 
         placeholder={"example@123"} 
       />
        <Button 
          disabled={loading}
          text={ loading ? "Loading..." : "Login using and Email and Password"} 
          onClick={loginUsingEmail}
        />
        <p  className='p-login' > or </p>
        <Button 
          disabled={loading}
          text={ loading ? "Loading..." : "Login using google"} 
          blue={true} 
          onClick={googleAuth} 
        />
        <p  className='p-login p-click' onClick={() => setLoginForm(!loginForm) } > Don't Have An Account? Click Here </p>
     
      </form>
      </div> ) : (
      <div className='signup-wrapper'>
      <h2 className='title'>
        Sing Up on<span style={{color:"var(--theme)"}}> Financium</span>
      </h2>
      <form>
        <Input 
         label={"Full Name"}  
         state={name} 
         setState={setName} 
         placeholder={"John Doe"} 
       />
        <Input         
         label={"Email"}  
         state={email} 
         setState={setEmail} 
         placeholder={"JohnDoe@gmail.com"} 
       />
        <Input 
         type="password"
         label={"Password"}  
         state={password} 
         setState={setPassword} 
         placeholder={"example@123"} 
       />
        <Input 
         type="password"                     
         label={"Confirm Password"}  
         state={confirmPassword} 
         setState={setConfirmPassword} 
         placeholder={"example@123"} 
       />
        <Button 
          disabled={loading}
          text={ loading ? "Loading..." : "Signup using and Email and Password"} 
          onClick={signupWithEmail}
        />
        <p className='p-login' > or </p>
        <Button 
          disabled={loading}
          text={ loading ? "Loading..." : "Signup using google"} 
          blue={true} 
          onClick={googleAuth} 
        />
        <p className='p-login p-click' onClick={() => setLoginForm(!loginForm) } > Already Have An Account ? Click Here </p>

     
      </form>
      </div>) 
    }
    
    </> 
  )
}

export default SignupSigninComponent