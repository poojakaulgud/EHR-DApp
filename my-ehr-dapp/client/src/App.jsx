import { EthProvider } from "./contexts/EthContext";
import Intro from "./components/Intro/";
import Setup from "./components/Setup";
import Demo from "./components/Demo";
import Footer from "./components/Footer";
import Web3 from "web3"
import EhrAudit from "./contracts/EhrAudit.json";
import {useState, useEffect} from "react";
import moment from 'moment';


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
  




  return (
    <EthProvider>
      <div id="App">
        <div className="container">
          <Intro />
          <hr /> 
           <Setup />
          <hr />
          {/* <Demo /> */}

        <input
          placeholder="Enter a pid"
          onChange={ (e) => setpidstate(e.target.value) }
          value={val}
           />
        <button onClick={getPid}>Get Pid</button>
        <button onClick={() => setPid(val)}>Set Pid</button>
        {/* <p>{val}</p> */}
        <hr />
        <hr />
        <div> 
          <h1>Audit Fields</h1>
          <label>
            Uid: 
            <input type="text" 
            placeholder="Enter Uid"
            onChange={(e)=> setuidstate(e.target.value)}
            value={uid}
            />
          </label>
          <br />

          <label>
            Cid:            
            <input type="text" 
            placeholder="Enter Cid"
            onChange={(e)=> setcidstate(e.target.value)}
            value={cid}
            /> 
          </label><br />

          <label>
            <input
              type="radio"
              value="create"
              checked={action === 'create'}
              onChange={radioHandleChange}
            />
            Create
          </label> <br />
          <label>
            <input
              type="radio"
              value="delete"
              checked={action === 'delete'}
              onChange={radioHandleChange}
            />
            Delete
          </label> <br />
          <label>
            <input
              type="radio"
              value="change"
              checked={action === 'change'}
              onChange={radioHandleChange}
            />
            Change
          </label> <br />
          <label>
            <input
              type="radio"
              value="query"
              checked={action === 'query'}
              onChange={radioHandleChange}
            />
            Query
          </label> <br />
          <label>
            <input
              type="radio"
              value="print"
              checked={action === 'print'}
              onChange={radioHandleChange}
            />
            Print
          </label> <br />
          <label>
            <input
              type="radio"
              value="copy"
              checked={action === 'copy'}
              onChange={radioHandleChange}
            />
            Copy
          </label> <br />

          <input type="submit" value="Push Audit" 
          onClick={pushAuditRecord}
          />

        </div>

        <div>
          <h2>Display Patient Record</h2>
          <div>
          <button onClick={() => getPatientRecord(val)}>Get P Records for current pid</button>
          {patientDiv && <p>
            {Precords}
          </p>}
          </div>
        </div>

        <div>
          <h2>Display Company Record</h2>
          <div>
          <button onClick={() => getCompanyRecord('abc')}>Get C Records for cid</button>
          {companyDiv && <div>
          {Crecords.map((item, index) => (
            <div key={index}>
              <p>Record {index + 1}</p>              
              <li>Company:{item.CompanyId}</li>
              <li>Patient: {item.PatientId}</li>
              <li>User: {item.UserId}</li>
              <li>Action: {item.action}</li>
              <li>Timestamp: {item.timestamp}</li>
            </div>
            
          ))}
          </div>}
          </div>
        </div>

          <hr />
          <Footer />
        </div>

        

      </div>
    </EthProvider>
  );
}

export default App;
