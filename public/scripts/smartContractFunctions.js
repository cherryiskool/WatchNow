// later this will be used to store the video script in


let account;

const connectMetamask = async () => {
  if(window.ethereum !== "undefined") {
      const accounts = await ethereum.request({method: "eth_requestAccounts"});
      // this automatically checks the users wallet
      account = accounts[0];
      document.getElementById("userArea").innerHTML = `User Account: ${account}`;
  }
}

const connectContract = async () => {
  const ABI = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_channelName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_videoTitle",
          "type": "string"
        },
        {
          "internalType": "address payable[]",
          "name": "_reactedToContracts",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "_reactedToContractsPercentageCuts",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256",
          "name": "_percentageCut",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "applyContractTermsToDonation",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "channelName",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "percentageCut",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "reactedToContracts",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "reactedToContractsPercentageCuts",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "videoTitle",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

    let indexOfUrl = String(window.location.pathname).indexOf("watch/");
    let reactedToFileName = String(window.location.pathname).slice(indexOfUrl + 6);
    let req = await fetch( `/videos/upload/reactedToContractAddress/${reactedToFileName}`) 
    const Address = await req.json(); // Contract Address
    window.web3 =  await new Web3(window.ethereum);
    window.contract =  new window.web3.eth.Contract(ABI, Address);
    document.getElementById("contractArea").innerHTML = `Connected to Contract ${Address}`; // calling the elementID above

}

// send eth function
// takes amount and multiplies it (to send Eth rather than Wei)
const applyContractTermsToDonation = async () => {
    const amount = document.getElementById("depositInput").value *1000000000000000000; // have to multiply by this much
    try {
      
      await window.contract.methods.applyContractTermsToDonation().send({from: account, value: amount});

    }
    catch (err) {
      alert(err);
    }
}

