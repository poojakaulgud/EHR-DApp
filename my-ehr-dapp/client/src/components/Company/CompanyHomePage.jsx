import './CompanyHomePage.css';
import React, { useEffect, useState } from 'react';
import EhrAudit from "../../contracts/EhrAudit.json";
import Web3 from "web3";
import moment from 'moment';



function CompanyHomePage() {
  const [cid, setCid] = useState('');
  const [uid, setUid] = useState(''); 
  const [pid, setPid] = useState(''); 
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [action, setAction] = useState('');
  const [message, setMessage] = useState(''); // Added to handle messages
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

  const handleCidInput = (e) => {
    setCid(e.target.value);
  };

  async function pushAuditRecord(act){
    try{ 
      let getAccount = await web3.eth.getAccounts();
      let timestamp = moment().format('DD-MM-YYYY HH:mm:ss'); 
      console.log(typeof(cid), typeof(Number(pid)), typeof(Number(uid)), typeof(timestamp), typeof(act)); 
      if (!cid || !pid || !uid || !timestamp || !act){
        console.log("Data unavailable", cid, pid, uid, timestamp, act);
      }      
        const receipt =  await contract.methods.pushAuditEvent(cid, Number(pid), Number(uid), timestamp, act).send({from: getAccount[0],  gas: 500000});
        console.log('Transaction successful:', receipt);
        setMessage(`Transaction successful for the action: ${act}`);
        alert(`Audit Record Generated for: ${act} at ${timestamp}`);
    } catch(error){
      console.log(error);
    }
  }

  const executeAction = async (act) => {
    if (!cid) {
      alert('Please enter Company ID');
      return;
    }
    setAction(act);
    console.log(act)
    setLoading(true);
    if(act!==''){
        
    await pushAuditRecord(act);
    }
    setLoading(false);
  };
  

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
          timestamp: index.timestamp
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
      <h1>Audit Fields</h1>
              <label>Uid: 
                <input type="text" 
                  placeholder="Enter Uid"
                  onChange={(e)=> setUid(e.target.value)}
                  value={uid}
                  />
                </label>
                <br />

                <label>
                  Pid:            
                  <input type="text" 
                  placeholder="Enter Pid"
                  onChange={(e)=> setPid(e.target.value)}
                  value={pid}
                  /> 
                </label><br />
                <label>
                  Cid:            
                  <input type="text" 
                  placeholder="Enter Cid"
                  onChange={(e)=> setCid(e.target.value)}
                  value={cid}
                  /> 
                </label><br />
      </div>
      <div className='btn-group btndesign1' role='group' aria-label='Audit Actions'>
            {['create', 'delete', 'change', 'query', 'print', 'copy'].map((act) => (
          <button key={act} type='button' className={`btn btn-secondary btndesign ${action === act ? 'active' : ''}`}
                  onClick = {() => executeAction(act)}> 
            {act}
          </button> 
        ))}
      </div>
 
      
      <div className='design_b'>
        {message && <p>{message}</p>} 
      </div>
      
      
  <h3>Display Health Audit Records:</h3>
  <div className='design_b'>
        <input type="text" placeholder="Enter Company ID" value={cid} onChange={handleCidInput} />
        <button type="button" class="btn btn-warning" onClick={handleFetchRecords} disabled={!cid}>Click to view Audit Records</button>
      </div>
      <div >
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
      </div>
    </div>
  );
}

export default CompanyHomePage;