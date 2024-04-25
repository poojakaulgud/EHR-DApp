import React from 'react';
import './PatientLogin.css';
import CryptoJS from 'crypto-js';

function PatientLogin() {
  function passHandle(e){
    e.preventDefault();  //stops defualt actions from happening 
    //Taking the password from the input field
    const exampleInputPassword1 = document.getElementById('exampleInputPassword1');
    const p = exampleInputPassword1.value;
    const hashedP = CryptoJS.SHA256(p).toString(); //hashing the password
    console.log("Hashed password:", hashedP); //in the real world, we will send this field to our server
    exampleInputPassword1.value = '';

  }
    return (
        <div className='background'>

             <div className="d-flex justify-content-center align-items-center login-background txt_color">

            <div>
                <h2 className="text-center" class="fs-1">Patient Login</h2>
            
            <form onSubmit={passHandle}> 
  <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label">Email address</label>
    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"></input>
    <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div class="mb-3">
    <label for="exampleInputPassword1" class="form-label">Password</label>
    <input type="password" class="form-control" id="exampleInputPassword1"></input>
  </div>
  <div class="mb-3 form-check">
    <input type="checkbox" class="form-check-input" id="exampleCheck1"></input>
    <label class="form-check-label" for="exampleCheck1">Check me out</label>
  </div>
                <button type="button" className='btn btn-warning'>Login</button>
            </form>
        </div>
        </div>
        </div>
    );
}

export default PatientLogin;

