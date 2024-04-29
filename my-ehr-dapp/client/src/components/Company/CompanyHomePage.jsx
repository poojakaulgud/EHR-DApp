import './CompanyHomePage.css';
import React, { useEffect, useState } from 'react';
import EhrAudit from "../../contracts/EhrAudit.json";
import Web3 from "web3";
import moment from 'moment';



function CompanyHomePage() {
  const [cid, setCid] = useState('');
  const [uid, setUid] = useState(''); 
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [action, setAction] = useState('');
  const [message, setMessage] = useState(''); // Added to handle messages


  useEffect(() => {
    async function setContractAddress() {
      const initWeb3 = new Web3("http://localhost:7545");
      setWeb3(initWeb3);
      const networkId = await initWeb3.eth.net.getId();
      const contractAddress = EhrAudit.networks[networkId]?.address;
      if (!contractAddress) {
        throw new Error("Contract not found on the network.");
      }
      const initContract = new initWeb3.eth.Contract(EhrAudit.abi, contractAddress);
      setContract(initContract);
    }

    setContractAddress();
  }, []);

  const handleCidInput = (e) => {
    setCid(e.target.value);
  };

  async function pushAuditRecord(){
    try{ 
      let getAccount = await web3.eth.getAccounts();
      // let pid = await contract.methods.getPid().call();
      let pid = 1
      let uid = 101
      let timestamp = moment().format('DD-MM-YYYY HH:mm:ss'); 
      console.log(typeof(cid), typeof(Number(pid)), typeof(Number(uid)), typeof(timestamp), typeof(action)); 
      if (!cid || !pid || !uid || !timestamp || !action){
        throw new Error("Data unavailable");
      }      
        const receipt =  await contract.methods.pushAuditEvent(cid, Number(pid), Number(uid), timestamp, action).send({from: getAccount[0],  gas: 500000});
        //console.log('Transaction successful:', receipt);
        setMessage(`Transaction successful for the action: ${action}`);
    } catch(error){
      //setMessage('Transaction error for the specified action! ' + error.message); // Set error message
    //   if (error.receipt) {
    //     console.log('Transaction failed with receipt:', error.receipt);
    // }
    // console.error('Transaction error:', error);
    // if (error.message.includes('revert')) {
    //       console.log('INVALID USER')
    //   }
    }
  }

  const executeAction = async (act) => {
    if (!cid) {
      alert('Please enter Company ID');
      return;
    }
    // setLoading(true);
    // setAction(act); 
    // const success = await pushAuditRecord();
    // setLoading(false);

    // if (success) {
    //   alert(`Transaction successful for action: ${action}`);
    // }



    // setAction(act);
  //   setTimeout(async () => {
  //   setLoading(true);
  //   // const success = await pushAuditRecord();
  //   await pushAuditRecord();
  //   setLoading(false);

  //   // if (success) {
  //   //   alert(`Transaction successful for the action: ${act}`);
  //   // }
  // }, 0);
    setAction(act);
    setLoading(true);
    await pushAuditRecord();
    setLoading(false);
  };
  
    // setLoading(true);
    // try {
    //   // await pushAuditRecord();
    //   // let getAccount = await web3.eth.getAccounts();
    //   const success = await pushAuditRecord();
    //   if (success) {
    //     alert(`Transaction successful for action: ${action}`); 
    // }
    // } catch (error) {
    //   console.error(`Error executing ${action}: `, error);
    // } finally {
    //   setLoading(false);
    // }
  //};

  const handleFetchRecords = async () => {
    if (!cid) {
      alert('You entered invalid company ID, please enter the correct one!');
      return;
    }
    try {
      setLoading(true);
      let getAccount = await web3.eth.getAccounts();
      let company_records = await contract.methods.getCompanyRecords(cid).call();
      if (company_records.length === 0) {
        alert("No audit records found for this company!");
      } else {
        setRecords(company_records.map(index => ({
          CompanyId: index.CompanyId,
          PatientId: index.PatientId,
          UserId: index.UserId,
          action: index.action,
          timestamp: new Date(index.timestamp * 1000).toLocaleString()
        })));
      }
    } catch (error) {
      console.error('Error in fetching Records for this company!', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeAction = (event) => {
    setAction(event.target.value);
  };

  return (
    <div className='txt_color'>
      <h1>Welcome to the Company Dashboard!</h1>
      <hr />
      <div className='design_b'>
        <input type="text" placeholder="Enter Company ID" value={cid} onChange={handleCidInput} />
        <button type="button" class="btn btn-warning" onClick={handleFetchRecords} disabled={!cid}>Click to view Audit Records</button>
      </div>
      <div className='btn-group btndesign1' role='group' aria-label='Audit Actions'>
  {['create', 'delete', 'change', 'query', 'print', 'copy'].map((act) => (
    <button key={act} type='button' className={`btn btn-secondary btndesign ${action === act ? 'active' : ''}`}
            // onClick={() => { setAction(act); executeAction(); }}>
            onClick = {() => executeAction(act)}> 
      {act}
    </button> //changed the onClick to simplify and call execute directly
  ))}
 </div>
      
      <div className='design_b'>
        {message && <p>{message}</p>} 
      </div>
      <div className='design_b'>
  <h3>Audit Records:</h3>
  {records.map((record, index) => (
    <div key={index} style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
      <div>CompanyId: {record.CompanyId}</div>
      <div>PatientId: {record.PatientId}</div>
      <div>UserId: {record.UserId}</div>
      <div>Action: {record.action}</div>
      <div>Timestamp: {record.timestamp}</div>
    </div>
  ))}
      </div>
    </div>
  );
}

export default CompanyHomePage;