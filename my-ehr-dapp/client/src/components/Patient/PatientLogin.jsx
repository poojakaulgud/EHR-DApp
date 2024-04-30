import React from 'react';
import './PatientLogin.css';
import CryptoJS from 'crypto-js';
import {useState, useEffect} from "react";
import Web3 from "web3";
import EhrAudit from "../../contracts/EhrAudit.json";
import { Router, useNavigate } from 'react-router-dom';

function PatientLogin() {
  const [myLoginAction, setLoginAction] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setContractAddress();
  }, []);


  function passHandle(e){
    e.preventDefault();
    const exampleInputPassword1 = document.getElementById('exampleInputPassword1');
    const username = document.getElementById('patientID').value;
    const p = exampleInputPassword1.value;
    const hashedP = CryptoJS.SHA256(p).toString(); //hashing the password
    console.log("Hashed password:", hashedP); //in the real world, we will send this field to our server
    exampleInputPassword1.value = '';

    checkCredentials(username,hashedP);
  }
  async function checkCredentials(username,hashedP){
    try{
      let getAccount = await web3.eth.getAccounts();
      console.log(username);
      console.log(Number(username));
      console.log(typeof(Number(username)))
      let loginAction = await contract.methods.patientLoginFunction(Number(username),hashedP).call();
      setLoginAction(loginAction);
      
      console.log(myLoginAction);
      if(loginAction === 'Login Successful'){
        console.log('inif');
          navigate('/PatientHomePage');
        
      }
      // else{
      //   showAlertFunction(loginAction);
      // }
      else{
        alert(loginAction);
      }

    } catch(error){
      //console.log('here',error);
      // console.log(`The following username: ${username} is incorrect or the associated password is wrong`);
      // console.log('Error!', error);
      //alert('Invalid password');
    }
  }

  function showAlertFunction(loginAction){
    // Call Alert component from here, use "loginAction" as alert component content.
    console.log(loginAction);
    alert(loginAction);
  }

  async function setContractAddress(){
    const initWeb3 = new Web3("http://localhost:7545");
    setWeb3(initWeb3);
    const networkId = await initWeb3.eth.net.getId();
    const contractAddress = EhrAudit.networks[networkId]?.address;
    if (!contractAddress) {
      throw new Error("Contract not deployed on the detected network.");
   }
    const initContract = new initWeb3.eth.Contract(EhrAudit.abi, contractAddress);    
    setContract(initContract);
  }
    return (
        <div className='background'>

             <div className="d-flex justify-content-center align-items-center login-background txt_color">

            <div>
                <h2 className="text-center" class="fs-1">Patient Login</h2>
            
            <form onSubmit={passHandle}> 
  <div class="mb-3">
    <label for="patientID" class="form-label">Patient ID</label>
    <input type="text" class="form-control" id="patientID" aria-describedby="Help"></input>
  </div>
  <div class="mb-3">
    <label for="exampleInputPassword1" class="form-label">Password</label>
    <input type="password" class="form-control" id="exampleInputPassword1" data-toggle="tooltip" data-placement="right" title="We have hashed our passwords with SHA256"></input>    
    <div id="Help" class="form-text">We'll never share your passsword with anyone else.</div>
  </div>
  <div class="mb-3 form-check">
    <input type="checkbox" class="form-check-input" id="exampleCheck1"></input>
    <label class="form-check-label" for="exampleCheck1">Check me out</label>
  </div>
                <button type="submit" className='btn btn-warning'>Login</button>
            </form>
        </div>
        </div>
        </div>
    );
}

export default PatientLogin;

