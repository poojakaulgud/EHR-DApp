import React from 'react';
import './CompanyLogin.css';
import CryptoJS from 'crypto-js';
import Web3 from "web3"
import EhrAudit from "../../contracts/EhrAudit.json";
import {useState, useEffect} from "react";
import { Router, useNavigate } from 'react-router-dom';



function CompanyLogin() {
  const [myLoginAction, setLoginAction] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setContractAddress();
  }, []);


  function passHandle(e){
    e.preventDefault(); 
    //Taking the password from the input field
    const exampleInputPassword1 = document.getElementById('exampleInputPassword1');
    const username = document.getElementById('username').value;
    const cid = document.getElementById('companyName').value;
    const p = exampleInputPassword1.value;
    const hashedP = CryptoJS.SHA256(p).toString(); //hashing the password
    console.log("Hashed password:", hashedP); //in the real world, we will send this field to our server
    exampleInputPassword1.value = '';
    checkCredentials(cid,username,hashedP);
    
  }

  async function checkCredentials(cid, username,hashedP){
    try{
      let getAccount = await web3.eth.getAccounts();
      console.log(username);
      console.log(Number(username));
      console.log(typeof(Number(username)))
      let loginAction = await contract.methods.userLoginFunction(cid, Number(username),hashedP).call();
      setLoginAction(loginAction);
      
      console.log(myLoginAction);
      if(loginAction === 'Login Successful'){
        console.log('inif');
          navigate('/CompanyHomePage');
        
      }
      else{
        showAlertFunction(loginAction);
      }

    } catch(error){
      console.log('here',error);
    }
  }

  function showAlertFunction(loginAction){
    // Call Alert component from here, use "loginAction" as alert component content.
    console.log(loginAction);
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
                <h2 className="text-center fs-1" >Company Login</h2>

                
            
            <form onSubmit={passHandle}>
  {/* <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label">Email address</label>
    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"></input>
    <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
  </div> */}
  <div class="mb-3">
  <label htmlFor="companyName" class="form-label">Company Name</label>
  <input type="text" class="form-control" id="companyName" placeholder="Company Name"></input>
</div>
  <div class="mb-3">
  <label htmlFor="username" class="form-label">User ID</label>
  <input type="text" class="form-control" id="username" placeholder="Username"></input>
</div>
  <div class="mb-3">
    <label htmlFor="exampleInputPassword1" class="form-label">Password</label>
    <input type="password" class="form-control" id="exampleInputPassword1"></input>
    <div id="Help" class="form-text">We'll never share your passsword with anyone else.</div>
  </div>
  <div class="mb-3 form-check">
    <input type="checkbox" class="form-check-input" id="exampleCheck1"></input>
    <label class="form-check-label" htmlFor="exampleCheck1">Check me out</label>
  </div>
                <button type="submit" className='btn btn-warning'>Login</button>
            </form>
        </div>
        </div>
        </div>
    );
}

export default CompanyLogin;

