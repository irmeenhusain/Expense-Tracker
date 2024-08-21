import React from 'react';
import "./styles.css";

function Header() {
  function logoutFnc(){
    alert("logout!!");
  }
  return (
    <div className='navbar'>
      <p className='logo'>Financium</p>
      <p className='logo link' onClick={logoutFnc}>Logout</p>
    </div>
  )
}

export default Header;