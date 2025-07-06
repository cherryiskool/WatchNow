//SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0;

contract Token {

    // SEAN CODE

    //Address --> Contract -- deposit
    function deposit() public payable {
    }

    //Contract --> Address  -- withdrawal
    function withdraw(address payable _to, uint _amount) public {
        _to.transfer(_amount);
    }

    function getBalance() external view returns(uint) {
        return address(this).balance;
    }

    function getAddress() external view returns(address) {
        return address(this);
    }

    // VINCENT CODE


    function sendEth(address payable[] memory _addresses) public payable{
        // uint[] storage reactedToCreators;
        for (uint i = 0; i < _addresses.length; i++) {
            _addresses[i].transfer(msg.value/_addresses.length);
        }

    }
}