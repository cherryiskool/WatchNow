// later this will be used to store the video script in


// let account;
//         const connectMetamask = async () => {
//             if(window.ethereum !== "undefined") {
//                 const accounts = await ethereum.request({method: "eth_requestAccounts"});
//                 // this automatically checks the users wallet
//                 // may cause a bug if they have not entered one (will be fixed later)
//                 account = locals.userWallet;
//                 console.log(account, "hi");
//                 // document.getElementById("userArea").innerHTML = `User Account: ${account}`;
//             }
//         }

//         const connectContract = async () => {
//             const ABI = [
//     {
//       "inputs": [],
//       "name": "deposit",
//       "outputs": [],
//       "stateMutability": "payable",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "getAddress",
//       "outputs": [
//         {
//           "internalType": "address",
//           "name": "",
//           "type": "address"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "getBalance",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address payable",
//           "name": "_to",
//           "type": "address"
//         }
//       ],
//       "name": "sendEth",
//       "outputs": [],
//       "stateMutability": "payable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address payable",
//           "name": "_to",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "_amount",
//           "type": "uint256"
//         }
//       ],
//       "name": "withdraw",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     }
//   ];
//             const Address = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Taking Address from Remix 
//             window.web3 =  await new Web3(window.ethereum);
//             window.contract =  new window.web3.eth.Contract(ABI, Address);
//             console.log('poooooooooooooooooop', window.contract);
//             document.getElementById("contractArea").innerHTML = "Connected to Contract"; // calling the elementID above
//         }

//         const getContractAccount = async () => {
//             const data = await window.contract.methods.getAddress().call();
//             document.getElementById("contractAccount").innerHTML = `Contract Account: ${data}`;
//         }

//         const getBalanceApple = async () => { // const getBalanceApple is the HTML function & .contract.getBalance is the smart contract function
//             const data = await window.contract.methods.getBalance().call();
//             document.getElementById("balanceArea").innerHTML = `Contract Balance: ${data}`;
//         }

//         const depositContract = async () => {
//             const amount = document.getElementById("depositInput").value;
//             await window.contract.methods.deposit().send({from: account, value: amount});

//         }

//         const withdraw = async () => {
//             const amount = document.getElementById("amountInput").value;
//             const address = document.getElementById("addressInput").value;
//             await window.contract.methods.withdraw(address, amount).send({from: account});
            
//         }

//         const sendEth = async () => {
//             const amount = document.getElementById("depositInput").value;
//             console.log(amount, '<%= walletAddress %>')
//             receivingWallet = '<%= walletAddress %>'
//             console.log(receivingWallet);
//             await window.contract.methods.sendEth(receivingWallet).send({from: '<%= locals.userWallet %>', value: amount});
//         }