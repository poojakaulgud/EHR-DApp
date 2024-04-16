// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

library AssetLibrary{
  struct AuditEvent{
    uint256 PatientId;
    uint256 UserId;
    // address UserAddress;
    string timestamp;
    string action;
    string CompanyId;
  }

}
contract EhrAudit {
  
  mapping(uint256 => AssetLibrary.AuditEvent[]) public PatientRecords;
  // mapping(uint256 => AssetLibrary.AuditEvent[]) public UserRecords;
  mapping(string => AssetLibrary.AuditEvent[]) public CompanyRecords;
  uint256 Pid;
  uint256[] patientList;
  string[] companyList;
  uint256[] userList;

  event AuditEventLogged(uint256 pid, uint uid, string timestamp, string action, string cid);

  // constructor() public{
  //   patientList = [1,2,3,4,5,6,7,8,9,10];
  //   companyList = ['abc', 'pqr', 'xyz'];
  //   userList = [101,102,103];
  // }

  function pushAuditEvent(string memory cid, 
    uint256 pid, 
    uint uid, 
    // address uaddress,
    string memory timestamp,
    string memory action
    ) public{

      PatientRecords[pid].push(AssetLibrary.AuditEvent(
        pid, uid, timestamp, action, cid
      ));
      CompanyRecords[cid].push(AssetLibrary.AuditEvent(
        pid, uid, timestamp, action, cid
      ));

      emit AuditEventLogged(pid, uid, timestamp, action, cid);
    }


  function getPid() public view returns (uint256) {
    return Pid;
  }

  function writePid(uint256 newId) public {
    Pid = newId;
  }

  // function getUid() public view returns (uint256) {
  //   return PatientId;
  // }

  // function writeUid(uint256 newId) public {
  //   UserId = newId;
  // }
}
