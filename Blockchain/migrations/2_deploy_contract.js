const WrappedAeternity = artifacts.require("WrappedAeternity");

module.exports = function(deployer) {
  deployer.deploy(WrappedAeternity, "0x2C236317659243AD2Ca6d3d135858402E0107e76", "0x1641A6d1C0a5D7F47f83cc5638C41a2Dc31828C2", "0xf2a3197086b8637c197FF329a6aB0400a6D3749a");
};
