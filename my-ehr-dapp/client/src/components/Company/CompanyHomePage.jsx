import './CompanyHomePage.css';
import React, { useEffect, useState } from 'react';
import EhrAudit from "../../contracts/EhrAudit.json";
import Web3 from "web3";

function CompanyHomePage() {
  const [cid, setCid] = useState('');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [action, setAction] = useState('');

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


  const executeAction = async () => {
    if (!cid) {
      alert('Please enter a Company ID');
      return;
    }
  
    setLoading(true);
    try {
      let getAccount = await web3.eth.getAccounts();
  
      switch (action) {
        case 'create':
          //create
          console.log(`Executing create for ${cid}`);
          break;
        case 'delete':
          //delete
          console.log(`Executing delete for ${cid}`);
          break;
        case 'change':
          //change
          console.log(`Executing change for ${cid}`);
          break;
        case 'query':
          //querying
          await handleFetchRecords();
          break;
        case 'print':
          //print
          console.log('Printing records:', records);
          break;
        case 'copy':
          //copy
          navigator.clipboard.writeText(JSON.stringify(records));
          console.log('Records copied to clipboard');
          break;
        default:
          console.log('Invalid action');
          break;
      }
    } catch (error) {
      console.error(`Error executing ${action}: `, error);
    } finally {
      setLoading(false);
    }
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
      <div className='btn-group' role='group' aria-label='Audit Actions'>
  {['create', 'delete', 'change', 'query', 'print', 'copy'].map((act) => (
    <button key={act} type='button' className={`btn btn-secondary ${action === act ? 'active' : ''}`}
            onClick={() => { setAction(act); executeAction(); }}>
      {act}
    </button>
  ))}
</div>
      {loading && <p>Loading records...</p>}
      {records.length > 0 && (
        <div className='design_b'>
          <h3>Audit Records:</h3>
          {records.map((record, index) => (
            <p key={index}>{JSON.stringify(record)}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default CompanyHomePage;