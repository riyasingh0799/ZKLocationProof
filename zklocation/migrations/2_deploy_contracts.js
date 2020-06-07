var LocationVerifier = artifacts.require("../contracts/verifier.sol");
module.exports = function(deployer) {
deployer.deploy(LocationVerifier);
};