//SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0;

contract VideoReactTerms {
    // saves the title of the video to the blockchain
    string public videoTitle;
    // whole number percentage cut as solidity cannot store decimals
    // public to allow solidity to automatically create a getter function
    // ^ will be used when this conctract is sent money from other contracts
    uint8 public  percentageCut;
    // saves address of uploader
    address payable private uploader;
    // saves the addresses of the reacted to video contracts
    address payable[] private reactedToContracts;
    // saves the cuts that the original content creators in the above contracts desired
    uint8[] public reactedToContractsPercentageCuts;

    // when a smart contract is created it is created with the video title, address of the video owner, the contracts of the videos the user reacted to and their cuts saved permanently
    constructor(string memory _videoTitle, address payable[] memory _reactedToContracts, uint8[] memory _reactedToContractsPercentageCuts, uint8 _percentageCut) {
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
            for(uint8 i = 0; i < reactedToContracts.length; i++) {
                // transfer
                reactedToContracts[i].transfer(
                    // the value of the message divided by how much original content is used, multiplied by the percentage cut
                    // eg. Vincent reacts to Viktoria (percentage cut 40%) and Cherry (percentage cut 20%) and Nikita donates 10 eth to Vincent
                    // (10/2)*0.4 = 2 is sent to Viktoria
                    // (10/2)*0.6 = 3 is sent to Vincent
                    // (10/2)*0.2 = 1 is sent to Cherry
                    // (10/2)*0.8 = 4 is sent to Vincent
                    (msg.value/reactedToContracts.length)*(reactedToContractsPercentageCuts[i]/100)
                );
                uploader.transfer(
                    (msg.value/reactedToContracts.length)*(1 - (reactedToContractsPercentageCuts[i]/100))
                );
            }
        } 
        // if the video is not a react video simply donate everything to the uploader
        else {
            uploader.transfer(msg.value);
        }
    }
}