// import React from 'react'
import React, { useEffect, useState } from 'react';

import './PatientHomePage.css';
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>


function PatientHomePage({ getPatientRecord, getPid }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleButtonClick = async () => {
    try {
      setLoading(true);
      const pid = await getPid();  // Fetch patient ID dynamically
      if (!pid) {
        alert('Patient ID is not available.');
        setLoading(false);
        return;
      }
      const fetchedRecords = await getPatientRecord(pid);
      setRecords(fetchedRecords);
    } catch (error) {
      console.error('Failed to fetch patient records:', error);
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
        <button type="button" class="btn btn-warning" onClick={handleButtonClick}>Click to view Audit Records</button>
      </div>

      {loading && <p>Loading records...</p>}
      {records.length > 0 && (
        <div>
          <h3>Audit Records:</h3>
          {records.map((record, index) => (
            <p key={index}>{JSON.stringify(record)}</p> // Adjust as needed for your data structure
          ))}
        </div>
      )}





    </div>

    
  );
}

export default PatientHomePage;