// import { EthProvider } from "./contexts/EthContext";
import Intro from "./components/Intro/";
import Setup from "./components/Setup";
// import Demo from "./components/Demo";
import Footer from "./components/Footer";
import Web3 from "web3"
import EhrAudit from "./contracts/EhrAudit.json";
import {useState, useEffect} from "react";
import moment from 'moment';
import PatientLogin from "./components/Patient/PatientLogin"
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import CompanyLogin from "./components/Company/CompanyLogin";
import PatientHomePage from "./components/Patient/PatientHomePage"
import CompanyHomePage from "./components/Company/CompanyHomePage"



// const contractAddress = "0x06883Bde3EEAEA1D5C9650d89C82bd259CC91c01";

function App() {
  const [val, setpidstate] = useState(0);
  const [uid, setuidstate] = useState(101);
  const [cid, setcidstate] = useState('abc');
  const [companyDiv, setCompanyDiv] = useState(false);
  const [patientDiv, setPatientDiv] = useState(false);

  const [Precords, setPrecords] = useState(null);
  const [Crecords, setCrecords] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [action, setAction] = useState(null);

  useEffect(() => {
    setContractAddress();
  }, []);

  const radioHandleChange = (event) => {
    setAction(event.target.value);
  };

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

  async function getPid() {
    try {
      const getPid = await contract.methods.getPid().call();
      console.log('getPid', getPid)
      // comment here
      setpidstate(getPid);
      } catch (error) {
      console.log("Error:", error);
      }
    }

    async function setPid(val) {
      try {
        let getAccount = await web3.eth.getAccounts();
        console.log(getAccount);
        console.log("PID to set:", val); // Should show the PID value being set
        if (!val) {
            throw new Error("PID is undefined or empty.");
        }
        await contract.methods.writePid(val).send({ from: getAccount[0] });
        setpidstate(""); // Ensure this is renamed if you change the updater name
      } catch (error) {
        console.log("Error setting PID:", error);
      }
      }

  async function getPatientRecord(_pid){
    try{
      let getAccount = await web3.eth.getAccounts();
      let patient_records = await contract.methods.getPatientRecords(_pid).call();
      console.log('pr',patient_records)
      setPrecords(patient_records)
      setPatientDiv(true);
    } catch(error){
      console.log('here',error);
    }
  }

  async function getCompanyRecord(_cid){
    try{
      let getAccount = await web3.eth.getAccounts();
      let company_records = await contract.methods.getCompanyRecords(_cid).call();
      console.log('cr',company_records)
      setCrecords(company_records)
      setCompanyDiv(true);
    } catch(error){
      console.log('here',error);
    }
  }

  async function pushAuditRecord(){
    try{ 
      let getAccount = await web3.eth.getAccounts();
      let pid = await contract.methods.getPid().call();
      let timestamp = moment().format('DD-MM-YYYY HH:mm:ss'); 
      console.log(typeof(cid), typeof(Number(pid)), typeof(Number(uid)), typeof(timestamp), typeof(action)); 
      if (!cid || !pid || !uid || !timestamp || !action){
        throw new Error("Data unavailable");
      }      
        const receipt =  await contract.methods.pushAuditEvent(cid, Number(pid), Number(uid), timestamp, action).send({from: getAccount[0],  gas: 500000});
        console.log('Transaction successful:', receipt);
    } catch(error){
      if (error.receipt) {
        console.log('Transaction failed with receipt:', error.receipt);
    }
    console.error('Transaction error:', error);
    if (error.message.includes('revert')) {
          console.log('INVALID USER')
      }
    }
  }
  




//   return (
//     <EthProvider>
//           <Intro />
//           <Router>
//           <div id="App">
//           <div className="container">
//             <Intro />
//             <nav>
//               <Link to="/">Home</Link> |{" "}
//               <Link to="/patientLogin">Patient Login</Link> |{" "}
//             </nav>
//             <Routes>
//               <Route path="/" element={<Setup />} />
//               <Route path="/patientLogin" element={<PatientLogin />} />
//             </Routes>
//             <Footer />
//           </div>
//         </div>

//         </Router>
        //   <hr /> 
        //    <Setup />
        //   <hr />
        //   {/* <Demo /> */}

        // <input
        //   placeholder="Enter a pid"
        //   onChange={ (e) => setpidstate(e.target.value) }
        //   value={val}
        //    />
        // <button onClick={getPid}>Get Pid</button>
        // <button onClick={() => setPid(val)}>Set Pid</button>
        // {/* <p>{val}</p> */}
        // <hr />
        // <hr />
        // <div> 
        //   <h1>Audit Fields</h1>
        //   <label>
        //     Uid: 
        //     <input type="text" 
        //     placeholder="Enter Uid"
        //     onChange={(e)=> setuidstate(e.target.value)}
        //     value={uid}
        //     />
        //   </label>
        //   <br />

        //   <label>
        //     Cid:            
        //     <input type="text" 
        //     placeholder="Enter Cid"
        //     onChange={(e)=> setcidstate(e.target.value)}
        //     value={cid}
        //     /> 
        //   </label><br />

        //   <label>
        //     <input
        //       type="radio"
        //       value="create"
        //       checked={action === 'create'}
        //       onChange={radioHandleChange}
        //     />
        //     Create
        //   </label> <br />
        //   <label>
        //     <input
        //       type="radio"
        //       value="delete"
        //       checked={action === 'delete'}
        //       onChange={radioHandleChange}
        //     />
        //     Delete
        //   </label> <br />
        //   <label>
        //     <input
        //       type="radio"
        //       value="change"
        //       checked={action === 'change'}
        //       onChange={radioHandleChange}
        //     />
        //     Change
        //   </label> <br />
        //   <label>
        //     <input
        //       type="radio"
        //       value="query"
        //       checked={action === 'query'}
        //       onChange={radioHandleChange}
        //     />
        //     Query
        //   </label> <br />
        //   <label>
        //     <input
        //       type="radio"
        //       value="print"
        //       checked={action === 'print'}
        //       onChange={radioHandleChange}
        //     />
        //     Print
        //   </label> <br />
        //   <label>
        //     <input
        //       type="radio"
        //       value="copy"
        //       checked={action === 'copy'}
        //       onChange={radioHandleChange}
        //     />
        //     Copy
        //   </label> <br />

        //   <input type="submit" value="Push Audit" 
        //   onClick={pushAuditRecord}
        //   />

        // </div>

        // <div>
        //   <h2>Display Patient Record</h2>
        //   <div>
        //   <button onClick={() => getPatientRecord(val)}>Get P Records for current pid</button>
        //   {patientDiv && <p>
        //     {Precords}
        //   </p>}
        //   </div>
        // </div>

        // <div>
        //   <h2>Display Company Record</h2>
        //   <div>
        //   <button onClick={() => getCompanyRecord('abc')}>Get C Records for cid</button>
        //   {companyDiv && <div>
        //   {Crecords.map((item, index) => (
        //     <div key={index}>
        //       <p>Record {index + 1}</p>              
        //       <li>Company:{item.CompanyId}</li>
        //       <li>Patient: {item.PatientId}</li>
        //       <li>User: {item.UserId}</li>
        //       <li>Action: {item.action}</li>
        //       <li>Timestamp: {item.timestamp}</li>
        //     </div>
            
        //   ))}
        //   </div>}
        //   </div>
        // </div>

        //   <hr />
        //   <Footer />

        

//     </EthProvider>
//   );
// }
return (
  // <EthProvider>
    <Router>
      <div className="bc">
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/PatientLogin" element={<PatientLogin />} />
        <Route path="/PatientHomePage" element={<PatientHomePage />} />
        <Route path="/CompanyLogin" element={<CompanyLogin />} />
        <Route path="/CompanyHomePage" element={<CompanyHomePage />} />

      </Routes>
      </div>
    </Router>
    
  // </EthProvider>
);
}

function MainContent() {
return (

  <div>   
    
    <div>
      <br /><br /><br /> 
    <div class="jumbotron jumbotron-fluid">
  <div class="container">
    <h1 class="display-4 text-center">My-EHR-DApp
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-shield-lock" viewBox="0 0 16 16">
      <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56"/>
      <path d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99a1.5 1.5 0 1 1 2-1.415"/>
    </svg>
    </h1>
    <p class="lead text-center">A prototype to demonstrate that data can never be erased.</p>
  </div>


</div>
    </div>


    <div class="d-flex justify-content-center">
      <nav className="nav nav-pills nav-justified navsize">
        <div class="justify-content-center mx-2">
          <div className="circle-card bg-light mx-2">
              <div className="content mx-2">
              <Link to="/patientLogin" className="nav-item nav-link nav-link-large ">                    
              <span class="text-dark">Patient Login</span>
                  <h2>        
                    <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" fill="black" class="bi bi-person-circle" viewBox="0 0 16 16">
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                      <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                    </svg>
                  </h2>
              </Link>
              </div>
          </div>
        </div>
        <div class="justify-content-center mx-2">
          <div className="circle-card bg-light mx-2">
              <div className="content mx-2">
              <Link to="/companyLogin" className="nav-item nav-link nav-link-large ">       
                <span class="text-dark">Company Login</span>
                  <h2>     
                    <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" fill="black" class="bi bi-person-circle" viewBox="0 0 16 16">
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                      <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                    </svg>
                  </h2>
              </Link>
              </div>
          </div>
        </div>
      </nav>
    </div>

    <div class="bg-light text-center fixed-bottom">
        <p>@Copyright-CSCI531</p>
    </div>
    
    

  </div>
);
}

export default App;
