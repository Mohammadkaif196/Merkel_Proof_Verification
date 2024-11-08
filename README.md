
# Merkle Proof Verification of Blockchain Transactions

### Task OverView

 In this task, we implement a system to verify the presence of a blockchain transaction within a block using Merkle proofs. This system will allow users to confirm whether a transaction is part of a Merkle tree built from the block's transactions. The project works on Sepolia testnet, where the smart contract stores the Merkle root of the block and verifies transactions through Merkle proofs.

 ## Merkel tree

 A Merkle Tree is a tree structure where each leaf node is a cryptographic hash of its underlying data and each non-leaf node is a hash of its direct descendants. Typically, Merkle trees have a branching factor of two, meaning that each node has up to two children. At the top of each tree is the root hash which changes each time a new leaf node is added to the tree.

 ## Merkel proof
  A Merkle proof is a sequence of hashes that allows you to verify that a specific transaction is part of the Merkle tree. This proof can be provided along with the transaction hash to verify its inclusion.

  




## Technologies Used

- Frontend
   - Reactjs
   - Tailwind css
- Backend
  - Solidity

  


## How to Run the Task

To run this task on your local machine, follow these steps:

Clone the repository
```bash
  git clone https://github.com/Mohammadkaif196/charter--21bce9443-
```
Install the dependencies
```bash
   npm install
```
Go to the util folder and open fetchData file and write your api key their
```bash
 const provider = new ethers.providers.JsonRpcProvider(`https://mainnet.infura.io/v3/${YOUR_API_KEY}`);
```
Now the task using command
```bash
    npm start
```
The project should now be running on your localhost. Access it by visiting http://localhost:3000 in your web browser.


## Images of the Task
Initial interface of the Task looks like this:

![App Screenshot](https://github.com/Mohammadkaif196/charter--21bce9443-/blob/main/src/images/pic1.png)

Enter the blockNumber and click on the button,then metamask will open,you need pay fee for that,after confirm that you will  get the list of transactions in that particular block
as shown below:

![App Screenshot](https://github.com/Mohammadkaif196/charter--21bce9443-/blob/main/src/images/pic2.png)

Enter the hash of transaction to verify.If it is present in that block then it will show you valid as show below:

![App Screenshot](https://github.com/Mohammadkaif196/charter--21bce9443-/blob/main/src/images/pic3.png?raw=true)

If transaction is not present in that block you will get invalid
as shown below:

![App Screenshot](https://github.com/Mohammadkaif196/charter--21bce9443-/blob/main/src/images/pic3.png?raw=true)







## Author

Shaik Mohammad Kaif

LinkedIn - [https://www.linkedin.com/in/shaik-mohammad-kaif196](https://www.linkedin.com/in/shaik-mohammad-kaif196);

Github - [https://github.com/Mohammadkaif196](https://github.com/Mohammadkaif196)

