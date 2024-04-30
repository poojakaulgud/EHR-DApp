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
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(prevIndex => prevIndex === index ? null : index);
};

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
          timestamp: index.timestamp
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
       
      <h3 class="text-center">View Audit Records:</h3>
      {/* <div className='design_b'>
        {records.map((record, index) => (
          <div key={index} style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
            <ul class="list-group">
            <li class="list-group-item bg-light font-italic">Record {index}:{JSON.stringify(record)}</li>
              <li class="list-group-item">CompanyId: {record.CompanyId}</li>
              <li class="list-group-item">PatientId: {record.PatientId}</li>
              <li class="list-group-item">UserId: {record.UserId}</li>
              <li class="list-group-item">Action: {record.action}</li>
              <li class="list-group-item">Timestamp: {record.timestamp}</li>
            </ul>
          </div>
        ))}
      </div> */}

      <div class="justify-content-center">
      {records.map((record, index) => (
                <div key={index} style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                    <button
                        className="btn btn-block btn-light text-left"
                        type="button"
                        onClick={() => toggle(index)}
                        aria-expanded={openIndex === index}
                        aria-controls={`collapse${index}`}
                    >
                        Record {index}: {JSON.stringify(record)}
                    </button>
                    <div
                        className={`collapse ${openIndex === index ? 'show' : ''}`}
                        id={`collapse${index}`}
                    >
                        <ul className="list-group">
                            <li className="list-group-item">CompanyId: {record.CompanyId}</li>
                            <li className="list-group-item">PatientId: {record.PatientId}</li>
                            <li className="list-group-item">UserId: {record.UserId}</li>
                            <li className="list-group-item">Action: {record.action}</li>
                            <li className="list-group-item">Timestamp: {record.timestamp}</li>
                        </ul>
                    </div>
                </div>
            ))}
        </div>

      <div className='design_b'>

        <input type="text" placeholder="Enter Patient ID" value={pid} onChange={handlePidInput} />
      
        <button type="button" class="btn btn-warning" data-toggle="tooltip" data-placement="bottom" title="Fetch records from blockchain" onClick={handleFetchRecords} disabled={!pid}>Click to view Audit Records</button>
      </div>

     
    
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
          <a href="#" class="btn btn-primary" data-toggle="tooltip" data-placement="bottom" title="This would be connected to the patient health record Database">Get Data</a>
        </div>
      </div>
      <br/><br/><br/>

      <div class="bg-light text-center fixed-bottom text-dark">
        <p>@Copyright-CSCI531</p>
    </div>



    </div>

    
  );
}

export default PatientHomePage;