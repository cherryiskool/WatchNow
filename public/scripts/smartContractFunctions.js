// later this will be used to store the video script in


let account;

        const connectMetamask = async () => {
            if(window.ethereum !== "undefined") {
                const accounts = await ethereum.request({method: "eth_requestAccounts"});
                // this automatically checks the users wallet
                // may cause a bug if they have not entered one (will be fixed later)
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
          "name": "_videoTitle",
          "type": "string"
        },
        {
          "internalType": "address payable[]",
          "name": "_reactedToContracts",
          "type": "address[]"
        },
        {
          "internalType": "uint8[]",
          "name": "_reactedToContractsPercentageCuts",
          "type": "uint8[]"
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
      "name": "percentageCut",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
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
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
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
            const Address = "0xF3645F7dE75E3A6e61aB2Fabdc831239C242f95c"; // Contract Address
            window.web3 =  await new Web3(window.ethereum);
            window.contract =  new window.web3.eth.Contract(ABI, Address);
            document.getElementById("contractArea").innerHTML = "Connected to Contract"; // calling the elementID above
        }

        // send eth function
        // takes amount and multiplies it (to send Eth rather than Wei)
        const applyContractTermsToDonation = async () => {
            const amount = document.getElementById("depositInput").value *1000000000000000000; // have to multiply by this much
            // console.log(amount, '%= walletAddresses %>')
            receivingWallets = '<%= walletAddresses %>'.split(",")
            console.log('The receiving address is anything after this :',receivingWallets);
            console.log('The from wallet address is anything after this:', account)
            await window.contract.methods.applyContractTermsToDonation().send({from: account, value: amount});
        }
