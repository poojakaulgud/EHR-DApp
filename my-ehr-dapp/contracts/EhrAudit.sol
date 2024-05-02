// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;


library AssetLibrary{
  

  

}
contract EhrAudit {

struct AuditEvent{
    uint16 PatientId;
    uint16 UserId;
    string timestamp;
    string action;
    string CompanyId;
  }

  
  mapping(uint16 => AuditEvent[]) public PatientRecords;
  mapping(string => AuditEvent[]) public CompanyRecords;
  uint16 Pid;
  string[] companyList;
  string[] uPassList;
  string[] pPassList;
  bool flag;

  struct User {
        uint16 uid;
        string passwordHash;  
    }
    
    User[] public userList;

    struct Patient {
        uint16 pid;
        string passwordHash;  
    }
    
    Patient[] public patientList;

  event AuditEventLogged(uint16 pid, uint uid, string timestamp, string action, string cid);

  constructor() {
    // patientList = [1,2,3,4,5,6,7,8,9,10];

    companyList = ['abc', 'pqr', 'xyz'];
    // pPassList = ['NailUntilAtrophy','TheeUnwrittenUngreased',
    // 'KelpSurelyTinfoil','GoatskinStudiedCreed','WildfireLiabilityMurky',
    // 'CountlessCrisplyReformat','StoningObsoleteOpen','GripStoppageUnmoving',
    // 'OboeRadiantlyMaterial','BountifulGuidePalace'
    // ];
    
    // userList = [101,102,103];
    // uPassList = [GratifyPropsTraps,SwipeHurrayScholar,UncountedDexterityElaborate];
    
  }

  function hashPassword(string memory password) private pure returns(bytes32) {
        return sha256(abi.encodePacked(password));
    }

    function toHex(bytes32 data) public pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    toHex16(bytes16(data)),
                    toHex16(bytes16(data << 128))
                )
            );
    }

    function toHex16(bytes16 data) internal pure returns (bytes32 result) {
        result =
            (bytes32(data) &
                0xFFFFFFFFFFFFFFFF000000000000000000000000000000000000000000000000) |
            ((bytes32(data) &
                0x0000000000000000FFFFFFFFFFFFFFFF00000000000000000000000000000000) >>
                64);
        result =
            (result &
                0xFFFFFFFF000000000000000000000000FFFFFFFF000000000000000000000000) |
            ((result &
                0x00000000FFFFFFFF000000000000000000000000FFFFFFFF0000000000000000) >>
                32);
        result =
            (result &
                0xFFFF000000000000FFFF000000000000FFFF000000000000FFFF000000000000) |
            ((result &
                0x0000FFFF000000000000FFFF000000000000FFFF000000000000FFFF00000000) >>
                16);
        result =
            (result &
                0xFF000000FF000000FF000000FF000000FF000000FF000000FF000000FF000000) |
            ((result &
                0x00FF000000FF000000FF000000FF000000FF000000FF000000FF000000FF0000) >>
                8);
        result =
            ((result &
                0xF000F000F000F000F000F000F000F000F000F000F000F000F000F000F000F000) >>
                4) |
            ((result &
                0x0F000F000F000F000F000F000F000F000F000F000F000F000F000F000F000F00) >>
                8);
        result = bytes32(
            0x3030303030303030303030303030303030303030303030303030303030303030 +
                uint256(result) +
                (((uint256(result) +
                    0x0606060606060606060606060606060606060606060606060606060606060606) >>
                    4) &
                    0x0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F) *
                39
        );
    }


  function addUser(uint16 uid, string memory password) public {
        userList.push(User(uid, toHex((hashPassword(password)))));
    }


    function addPatient(uint16 pid, string memory password) public {
        patientList.push(Patient(pid, toHex((hashPassword(password)))));
    }


  function pushAuditEvent(string memory cid, 
    uint16 pid, 
    uint16 uid, 
    string memory timestamp,
    string memory action
    ) public {
        require(isUidValid(uid), "Invalid UID: Operation Reverted.");

        PatientRecords[pid].push(AuditEvent(
          pid, uid, timestamp, action, cid
        ));
        CompanyRecords[cid].push(AuditEvent(
          pid, uid, timestamp, action, cid
        ));               

        emit AuditEventLogged(pid, uid, timestamp, action, cid); 
       
    }

    function isUidValid(uint16 uid) public view returns (bool) {
        for (uint i = 0; i < userList.length; i++) {
            if (userList[i].uid == uid) {
                return true; 
            }
        }
        return false; 
    }

    function getPatientRecords(uint16 pid) public view returns (AuditEvent[] memory) {
        return PatientRecords[pid];
    }

    function getCompanyRecords(string memory cid) public view returns (AuditEvent[] memory) {
        return CompanyRecords[cid];
    }


  function getPid() public view returns (uint16) {
    return Pid;
  }

  function writePid(uint16 newId) public {
    Pid = newId;
  }

  function userLoginFunction(string memory cid, uint16 id, string memory pass) public view returns(string memory) {
    for (uint j = 0; j < companyList.length; j++) {
        if(keccak256(abi.encodePacked(companyList[j])) == keccak256(abi.encodePacked(cid))){
            for (uint i = 0; i < userList.length; i++) {
              if (userList[i].uid == id) {
                  if (keccak256(abi.encodePacked(userList[i].passwordHash)) == keccak256(abi.encodePacked(pass))) {
                      return "Login Successful";
                  } else {
                      return "Invalid Password";
                  }
              }
            }
            return "Invalid UserID";
            }
        }
        return "Invalid CompanyID";
    }


    function patientLoginFunction(uint16 pid, string memory pass) public view returns(string memory) {
            for (uint i = 0; i < patientList.length; i++) {
              if (patientList[i].pid == pid) {
                  if (keccak256(abi.encodePacked(patientList[i].passwordHash)) == keccak256(abi.encodePacked(pass))) {
                      return "Login Successful";
                  } else {
                      return "Invalid Password";
                  }
              }
            }
            return "Invalid PatientID";
            }

}
