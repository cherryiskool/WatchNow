let account;

ABI = [
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
  ]

const bytecode = "0x60806040523480156200001157600080fd5b506040516200106438038062001064833981810160405281019062000037919062000463565b33600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550846001908051906020019062000090929190620000ee565b508360009080519060200190620000a9929190620000ee565b508260049080519060200190620000c29291906200017f565b508160059080519060200190620000db9291906200020e565b508060028190555050505050506200074a565b828054620000fc9062000682565b90600052602060002090601f0160209004810192826200012057600085556200016c565b82601f106200013b57805160ff19168380011785556200016c565b828001600101855582156200016c579182015b828111156200016b5782518255916020019190600101906200014e565b5b5090506200017b919062000260565b5090565b828054828255906000526020600020908101928215620001fb579160200282015b82811115620001fa5782518260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555091602001919060010190620001a0565b5b5090506200020a919062000260565b5090565b8280548282559060005260206000209081019282156200024d579160200282015b828111156200024c5782518255916020019190600101906200022f565b5b5090506200025c919062000260565b5090565b5b808211156200027b57600081600090555060010162000261565b5090565b60006200029662000290846200057d565b62000549565b90508083825260208201905082856020860282011115620002b657600080fd5b60005b85811015620002ea5781620002cf8882620003ae565b845260208401935060208301925050600181019050620002b9565b5050509392505050565b60006200030b6200030584620005ac565b62000549565b905080838252602082019050828560208602820111156200032b57600080fd5b60005b858110156200035f57816200034488826200044c565b8452602084019350602083019250506001810190506200032e565b5050509392505050565b6000620003806200037a84620005db565b62000549565b9050828152602081018484840111156200039957600080fd5b620003a68482856200064c565b509392505050565b600081519050620003bf8162000716565b92915050565b600082601f830112620003d757600080fd5b8151620003e98482602086016200027f565b91505092915050565b600082601f8301126200040457600080fd5b815162000416848260208601620002f4565b91505092915050565b600082601f8301126200043157600080fd5b81516200044384826020860162000369565b91505092915050565b6000815190506200045d8162000730565b92915050565b600080600080600060a086880312156200047c57600080fd5b600086015167ffffffffffffffff8111156200049757600080fd5b620004a5888289016200041f565b955050602086015167ffffffffffffffff811115620004c357600080fd5b620004d1888289016200041f565b945050604086015167ffffffffffffffff811115620004ef57600080fd5b620004fd88828901620003c5565b935050606086015167ffffffffffffffff8111156200051b57600080fd5b6200052988828901620003f2565b92505060806200053c888289016200044c565b9150509295509295909350565b6000604051905081810181811067ffffffffffffffff82111715620005735762000572620006e7565b5b8060405250919050565b600067ffffffffffffffff8211156200059b576200059a620006e7565b5b602082029050602081019050919050565b600067ffffffffffffffff821115620005ca57620005c9620006e7565b5b602082029050602081019050919050565b600067ffffffffffffffff821115620005f957620005f8620006e7565b5b601f19601f8301169050602081019050919050565b60006200061b8262000622565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b60005b838110156200066c5780820151818401526020810190506200064f565b838111156200067c576000848401525b50505050565b600060028204905060018216806200069b57607f821691505b60208210811415620006b257620006b1620006b8565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b62000721816200060e565b81146200072d57600080fd5b50565b6200073b8162000642565b81146200074757600080fd5b50565b61090a806200075a6000396000f3fe6080604052600436106100555760003560e01c80630a84842b1461005a5780632443877c1461006457806374f321991461008f578063a2d48c6f146100ba578063b5cd59b4146100f7578063f4f4224614610134575b600080fd5b61006261015f565b005b34801561007057600080fd5b506100796103e8565b604051610086919061061d565b60405180910390f35b34801561009b57600080fd5b506100a4610476565b6040516100b1919061061d565b60405180910390f35b3480156100c657600080fd5b506100e160048036038101906100dc9190610582565b610504565b6040516100ee919061063f565b60405180910390f35b34801561010357600080fd5b5061011e60048036038101906101199190610582565b610528565b60405161012b9190610602565b60405180910390f35b34801561014057600080fd5b50610149610567565b604051610156919061063f565b60405180910390f35b6000600480549050111561037c5760005b600480549050811015610376576000600582815481106101b9577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b9060005260206000200154346101cf91906106a7565b9050600060646004805490506101e591906106a7565b905060048381548110610221577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16630a84842b82846102739190610676565b6040518263ffffffff1660e01b81526004016000604051808303818588803b15801561029e57600080fd5b505af11580156102b2573d6000803e3d6000fd5b5050505050600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc8260048054905061030491906106a7565b6004805490508561031591906106a7565b348561032191906106a7565b61032b9190610701565b6103359190610676565b9081150290604051600060405180830381858888f19350505050158015610360573d6000803e3d6000fd5b505050808061036e906107d6565b915050610170565b506103e6565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc349081150290604051600060405180830381858888f193505050501580156103e4573d6000803e3d6000fd5b505b565b600180546103f5906107a4565b80601f0160208091040260200160405190810160405280929190818152602001828054610421906107a4565b801561046e5780601f106104435761010080835404028352916020019161046e565b820191906000526020600020905b81548152906001019060200180831161045157829003601f168201915b505050505081565b60008054610483906107a4565b80601f01602080910402602001604051908101604052809291908181526020018280546104af906107a4565b80156104fc5780601f106104d1576101008083540402835291602001916104fc565b820191906000526020600020905b8154815290600101906020018083116104df57829003601f168201915b505050505081565b6005818154811061051457600080fd5b906000526020600020016000915090505481565b6004818154811061053857600080fd5b906000526020600020016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60025481565b60008135905061057c816108bd565b92915050565b60006020828403121561059457600080fd5b60006105a28482850161056d565b91505092915050565b6105b481610735565b82525050565b60006105c58261065a565b6105cf8185610665565b93506105df818560208601610771565b6105e8816108ac565b840191505092915050565b6105fc81610767565b82525050565b600060208201905061061760008301846105ab565b92915050565b6000602082019050818103600083015261063781846105ba565b905092915050565b600060208201905061065460008301846105f3565b92915050565b600081519050919050565b600082825260208201905092915050565b600061068182610767565b915061068c83610767565b92508261069c5761069b61084e565b5b828204905092915050565b60006106b282610767565b91506106bd83610767565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff04831182151516156106f6576106f561081f565b5b828202905092915050565b600061070c82610767565b915061071783610767565b92508282101561072a5761072961081f565b5b828203905092915050565b600061074082610747565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b60005b8381101561078f578082015181840152602081019050610774565b8381111561079e576000848401525b50505050565b600060028204905060018216806107bc57607f821691505b602082108114156107d0576107cf61087d565b5b50919050565b60006107e182610767565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8214156108145761081361081f565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000601f19601f8301169050919050565b6108c681610767565b81146108d157600080fd5b5056fea2646970667358221220ae2b5f352479d2d847c5ff7d7955378a178e9aba133b98cc0f5705a57dcbe65164736f6c63430008000033"

const connectMetamask = async () => {
    if(window.ethereum !== "undefined") {
        const accounts = await ethereum.request({method: "eth_requestAccounts"});
        // this automatically checks the users wallet
        account = accounts[0];
        document.getElementById("userArea").innerHTML = `User Account: ${account}`;
    }
}

const deployContract = async (event) => {
    // stops submission from happening immediately
    event.preventDefault();

    // try this
    try {
        window.web3 =  await new Web3(window.ethereum);
        window.contract =  new window.web3.eth.Contract(ABI);

        // gets the video title from the form
        const videoTitle = String(document.getElementById("videoTitle").value)

        // gets the links to the reacted to videos
        let reactedToLinks = document.getElementsByClassName("reactedTo");

        // creates array to store contracts of reacted to videos
        let reactedToContracts = []
        let reactedToContractsCuts = []

        console.log("ReactedToLinks",reactedToLinks)
        // for every reacted to link
        for(const reactedToLink of reactedToLinks) {
            // get the filename of the video they linked to
            if(reactedToLink.value !== "") {
              let indexOfUrl = String(reactedToLink.value).indexOf("watch/");
              let reactedToFileName = String(reactedToLink.value).slice(indexOfUrl + 6);

              if (reactedToFileName == '') {
                reactedToFileName = reactedToLink.value;
              }
              // request the contract address of their video
              let contractAddressRequest = await fetch( `/videos/upload/reactedToContractAddress/${reactedToFileName}`)
              if (!contractAddressRequest.ok) {
                contractAddressRequest = contractAddressRequest.json()
                throw new Error(contractAddressRequest.error);
              }

              let contractAddress = await contractAddressRequest.json();
              contractAddress = contractAddress.address
              
              window.contract =  new window.web3.eth.Contract(ABI, contractAddress);
              let contractCut = await window.contract.methods.percentageCut().call();
              // add the contract address to the reacted to contracts 
              // so later we can put this in the reaction smart contract
              reactedToContracts.push(contractAddress);
              reactedToContractsCuts.push(contractCut);
            }

        }

        let channelNameRequest = await fetch('/getSessionUsername');

        if (!channelNameRequest.ok) {
          channelNameRequest = await channelNameRequest.json()
          throw new Error(channelNameRequest.error);
        }

        let channelName = await channelNameRequest.json();
        channelName = channelName.channelName;

        // get the percentage cut the creator wants
        const percentageCut = Number(document.getElementById("percentageCut").value)

        // prevents invalid percentages
        if (percentageCut > 100 || percentageCut < 0) {
          throw new Error('Invalid percentage cut');
        } 

        document.getElementById("userArea").innerHTML = 'Please wait for your contract to deploy and save before leaving this page...'

        // deploy the contract with all the relevant variables
        const deployment = await window.contract.deploy({
            data: bytecode,
            arguments:[channelName, videoTitle, reactedToContracts, reactedToContractsCuts, percentageCut]
        }).send({from: account, gas: 6000000})


        // create form object from form and POST it
        const videoData = new FormData(event.target);

        let upload = await fetch('/videos/upload', {
            method: 'POST', 
            body: videoData
        });

        console.log(deployment.options.address);


        if (!upload.ok) {
          upload = await upload.json();
          console.log('error', upload)
          throw new Error(upload.error);
        }

        // video filename 

        let videoFilename = await upload.json();
        videoFilename = videoFilename.filename;

        // may change the POST to send the data through body rather than the url
        // ^ not strictly necessary as no private data is used
        // this uses the route that saves the contract address data 
        let setContract = await fetch(`/videos/upload/reactedToContractAddress/${videoFilename}/${deployment.options.address}`, {
            method: 'POST'
        });

        if(!setContract.ok) {
          setContract = setContract.json();
          throw new Error(setContract.error);
        }

        document.getElementById("userArea").innerHTML = `Contract successfully deployed to ${deployment.options.address}`
    } 

    catch (err) {
        alert(err);
    }
}

