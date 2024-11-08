const { ethers} = require("ethers"); 


const provider = new ethers.providers.JsonRpcProvider(`https://mainnet.infura.io/v3/4f26b6e629fe4494b514488881dccb5a`);

async function fetchData(blockNumber) { 
    try {
        // Convert block number to an integer and validate
        const parseNumber = parseInt(blockNumber, 10);
        if (isNaN(parseNumber) || parseNumber < 0) {
          throw new Error("Invalid block number provided.");
        }
    
        // Fetch the block with transactions
        const block = await provider.getBlockWithTransactions(parseNumber);
        if (!block || !block.transactions.length) {
          throw new Error("No transactions found in the specified block.");
        }
    
        // Extract transaction hashes
        const transactionHashes = block.transactions.map((tx) => tx.hash);
        return transactionHashes;
      } catch (error) {
        console.error("Error fetching transactions:", error);
        throw error;
      }
    }
    
module.exports=fetchData;