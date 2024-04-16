const EhrAudit = artifacts.require("./EhrAudit.sol");

module.exports = function (deployer) {
  deployer.deploy(EhrAudit);
};
