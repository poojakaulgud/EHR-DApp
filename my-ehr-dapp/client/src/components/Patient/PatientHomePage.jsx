// import React from 'react'
import React, { useEffect, useState } from 'react';
import EhrAudit from "../../contracts/EhrAudit.json";
import Web3 from "web3"


import './PatientHomePage.css';

function PatientHomePage() {
  const [pid, setPid] = useState('');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);

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

  const handlePidInput = (e) => {
    setPid(e.target.value);
  };

  const handleFetchRecords = async () => {
    if (!pid) {
      alert('You entered invalid patient ID, please enter the correct one!');
      return;
    }
    try {
      setLoading(true);
      let getAccount = await web3.eth.getAccounts();
      let patient_records = await contract.methods.getPatientRecords(pid).call();
      if (patient_records.length === 0) {
        alert("No audit records found for this patient!");
      } else {
        //setRecords(patient_records);
        setRecords(patient_records.map(index => ({

          CompanyId: index.CompanyId,
          PatientId: index.PatientId,
          UserId: index.UserId,
          action: index.action,
          timestamp: new Date(index.timestamp * 1000).toLocaleString()
        })));
        }
    } catch (error) {
      console.error('Error in fetching Records for this patient!', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='txt_color'>
      <h1>Welcome to the Patient Dashboard!</h1>
      <hr></hr>
    
      <div class="card text-center">
        <div class="card-header">
          <ul class="nav nav-tabs card-header-tabs">
            <li class="nav-item">
              <a class="nav-link active" aria-current="true" href="#">Patient Screening Data</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Medical History</a>
            </li>
            <li class="nav-item">
              <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Insurance Details</a>
            </li>
          </ul>
        </div>
        <div class="card-body">
          <h5 class="card-title">NOTE</h5>
          <p class="card-text">In a real-world application all this data would be available using a database.</p>
          <a href="#" class="btn btn-primary">Get Data</a>
        </div>
      </div>
      <div className='design_b'>

        <input type="text" placeholder="Enter Patient ID" value={pid} onChange={handlePidInput} />
      
        <button type="button" class="btn btn-warning" onClick={handleFetchRecords} disabled={!pid}>Click to view Audit Records</button>
      </div>

      {/* {loading && <p>Loading records...</p>}
      {records.length > 0 && (
        <div className='design_b'>
          <h3>Audit Records:</h3>
          {records.map((record, index) => (
            <p key={index}>{JSON.stringify(record)}</p> 
          ))}
        </div>
      )} */}
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

export default PatientHomePage;