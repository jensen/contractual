//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Agreement {
  string public hashed;

  address public creator;
  address[] public signees;

  event AgreementSigned(string hashed, address signee);

  constructor(address _creator, string memory _hashed) {
    creator = _creator;
    hashed = _hashed;
  }

  function compareStringsByBytes(string memory s1, string memory s2) public pure returns(bool){
    return keccak256(abi.encodePacked(s1)) == keccak256(abi.encodePacked(s2));
  }

  function getHashed() public view returns (string memory) {
    return hashed;
  }

  function getSignees() public view returns (address[] memory) {
    return signees;
  }

  error DuplicateSignee(address signee);
  error MismatchedHash(string hashed);

  function sign(string memory _hashed) public {
    for (uint256 i = 0; i < signees.length; i++) {
      if (msg.sender == signees[i]) {
        revert DuplicateSignee(msg.sender);
      }
    }

    if(compareStringsByBytes(_hashed, hashed) == false) {
      revert MismatchedHash(_hashed);
    }

    signees.push(msg.sender);

    emit AgreementSigned(hashed, msg.sender);
  }
}
