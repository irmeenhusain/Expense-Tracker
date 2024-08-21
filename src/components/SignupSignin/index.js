import React, { useState } from 'react';
import "./styles.css";
import Input from '../Input';
import Button from '../Button';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from 'react-toastify';
import {auth} from "../../firebase";

function SignupSigninComponent(){
  const [name,setName] =useState("");
  const [email,setEmail] =useState("");
  const [password,setPassword] =useState("");
  const [confirmPassword,setConfirmPassword] =useState("");
  const [loading, setLoading] = useState(false);

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

  function createDoc(){
    //first make sure that the doc with the uid dosn't exists
    //Create doc
  }
  return (
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
        <p  style={{ textAlign: "center", margin:0}} > or </p>
        <Button 
          disabled={loading}
          text={ loading ? "Loading..." : "Signup using google"} 
          blue={true} 
        />
     
      </form>
    </div>
  )
}

export default SignupSigninComponent