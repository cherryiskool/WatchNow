//SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0;

// this is necessary to call the reactedToContracts functions
interface ReactedToVideoTerms {
    function applyContractTermsToDonation() external payable;
}

contract VideoReactTerms {
    // saves the title of the video to the blockchain
    string public videoTitle;

    // whole number percentage cut as solidity cannot store decimals
    // public to allow solidity to automatically create a getter function
    // ^ will be used when this conctract is sent money from other contracts
    uint256 public  percentageCut;
    // saves address of uploader
    address payable private uploader;
    // saves the addresses of the reacted to video contracts
    address payable[] public reactedToContracts;
    // saves the cuts that the original content creators in the above contracts desired
    uint256[] public reactedToContractsPercentageCuts;

    // when a smart contract is created it is created with the video title, address of the video owner, the contracts of the videos the user reacted to and their cuts saved permanently
    constructor(string memory _videoTitle, address payable[] memory _reactedToContracts, uint256[] memory _reactedToContractsPercentageCuts, uint256 _percentageCut) {
        uploader = payable(msg.sender);
        videoTitle = _videoTitle;
        reactedToContracts = _reactedToContracts;
        reactedToContractsPercentageCuts = _reactedToContractsPercentageCuts;
        percentageCut = _percentageCut;

    }
    
    // this function is called with a message value (payable)
    function applyContractTermsToDonation() public payable {
        // if the video is a react video
        if(reactedToContracts.length > 0) {
            // for each reacted to video
            for(uint256 i = 0; i < reactedToContracts.length; i++) {
                // transfer
                uint256 top = msg.value*reactedToContractsPercentageCuts[i];
                uint256 bottom = reactedToContracts.length*100;
            
                ReactedToVideoTerms(reactedToContracts[i]).applyContractTermsToDonation{value: top/bottom}();
            
                uploader.transfer(
                    (msg.value/reactedToContracts.length) - (top/bottom)
                );
            }
        } 
        // if the video is not a react video simply donate everything to the uploader
        else {
            uploader.transfer(msg.value);
        }
    }
}