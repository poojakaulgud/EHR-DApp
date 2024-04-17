// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

library AssetLibrary{
  struct AuditEvent{
    uint16 PatientId;
    uint16 UserId;
    // address UserAddress;
    string timestamp;
    string action;
    string CompanyId;
  }

}
contract EhrAudit {
  
  mapping(uint16 => AssetLibrary.AuditEvent[]) public PatientRecords;
  // mapping(uint16 => AssetLibrary.AuditEvent[]) public UserRecords;
  mapping(string => AssetLibrary.AuditEvent[]) public CompanyRecords;
  uint16 Pid;
  uint16[] patientList;
  string[] companyList;
  uint16[] userList;
  bool flag;

  event AuditEventLogged(uint16 pid, uint uid, string timestamp, string action, string cid);

  constructor() {
    patientList = [1,2,3,4,5,6,7,8,9,10];
    companyList = ['abc', 'pqr', 'xyz'];
    userList = [101,102,103];
  }

  function pushAuditEvent(string memory cid, 
    uint16 pid, 
    uint16 uid, 
    // address uaddress,
    string memory timestamp,
    string memory action
    ) public {
      //  if(isUidValid(uid)){
        require(isUidValid(uid), "Invalid UID: Operation Reverted.");

        PatientRecords[pid].push(AssetLibrary.AuditEvent(
          pid, uid, timestamp, action, cid
        ));
        CompanyRecords[cid].push(AssetLibrary.AuditEvent(
          pid, uid, timestamp, action, cid
        ));               

        emit AuditEventLogged(pid, uid, timestamp, action, cid);        
      //  }
       
    }

    function isUidValid(uint uid) public view returns (bool) {
        for (uint i = 0; i < userList.length; i++) {
            if (userList[i] == uid) {
                return true; 
            }
        }
        return false; 
    }

    function getPatientRecords(uint16 pid) public view returns (AssetLibrary.AuditEvent[] memory) {
        return PatientRecords[pid];
    }

    function getCompanyRecords(string memory cid) public view returns (AssetLibrary.AuditEvent[] memory) {
        return CompanyRecords[cid];
    }


  function getPid() public view returns (uint16) {
    return Pid;
  }

  function writePid(uint16 newId) public {
    Pid = newId;
  }

  // function getUid() public view returns (uint16) {
  //   return PatientId;
  // }

  // function writeUid(uint16 newId) public {
  //   UserId = newId;
  // }
}
