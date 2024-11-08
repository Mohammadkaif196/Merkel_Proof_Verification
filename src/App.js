import { useState } from "react";
import fetchData from "./utils/fetchData";
import merkleTree from "./utils/merkelTree";
import { ethers } from "ethers";
import contractabi from "./utils/contractabi";
import { Buffer } from "buffer";

function App() {
  const [blockNumber, setBlockNumber] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [proofLoading, setProofLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [proofError, setProofError] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [merkleRoot, setMerkleRoot] = useState(null);
  const [transactionHash, setTransactionHash] = useState("");
  const [merkleProof, setMerkleProof] = useState([]);
  const [isVerified, setIsVerified] = useState(false);
  const [proofNotExist, setProofNotExist] = useState(false); 
  const [currentView, setCurrentView] = useState("getTransactions"); 
  //contract address deployed in sepolia testnet
  const contractAddress = "0xf94D25E15403f1284b085DB51Ae2b31Cc5417b16";

  const getContract = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, contractabi, signer);
  };

  const handleFetchTransactions = async () => {
    setLoading(true);
    setFetchError("");
    setTransactions([]);
    setMerkleRoot(null);
    setMerkleProof([]);
    setIsVerified(false);
    setVerificationMessage("");
    setProofNotExist(false);

    try {
      const result = await fetchData(blockNumber);
      const transactionHashes = result.map((tx) => tx);
      setTransactions(transactionHashes);

      const { root } = merkleTree(transactionHashes, "");
      setMerkleRoot(root);

      const contract = await getContract();
      const tx = await contract.setMerkleRoot(root);
      await tx.wait();
    } catch (error) {
      setFetchError("Failed to fetch transactions. Please try again.");
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMerkleProof = async () => {
    if (!transactionHash || !merkleRoot) {
      setProofError("Please provide a valid transaction hash and Merkle root.");
      return;
    }

    setProofLoading(true);
    setProofError("");
    setVerificationMessage("");

    try {
      const { proof } = merkleTree(transactions, transactionHash);
      setMerkleProof(proof);

      if (proof.length > 0) {
        await verifyMerkleProofOnContract(proof);
      } else {
        setIsVerified(false);
        setProofNotExist(true);
        setVerificationMessage(
          "The provided transaction hash is not part of the Merkle tree."
        );
      }
    } catch (error) {
      setProofError("Failed to generate Merkle proof. Please try again.");
      console.error(error);
    } finally {
      setProofLoading(false);
    }
  };

  const verifyMerkleProofOnContract = async (proof) => {
    try {
      const contract = await getContract();
      const transactionHashs = `0x${ethers.utils
        .keccak256(Buffer.from(transactionHash))
        .slice(2)}`;

      if (proof.length > 0) {
        const isValid = await contract.verifyTransactionInclusion(
          transactionHashs,
          proof
        );
        setVerificationMessage(isValid[1] || "Verification complete.");
        setIsVerified(isValid[0]);
      } else {
        setVerificationMessage("Invalid transaction hash.");
        setIsVerified(false);
        setProofNotExist(true);
      }
    } catch (error) {
      setProofError("Failed to verify Merkle proof on contract.");
      console.error(error);
    }
  };

  const handleReset = () => {
    setLoading(false);
    setFetchError("");
    setTransactions([]);
    setMerkleRoot(null);
    setMerkleProof([]);
    setIsVerified(false);
    setVerificationMessage("");
    setProofError("");
    setBlockNumber("");
    setTransactionHash("");
    setProofNotExist(false);
    setCurrentView("getTransactions");
  };

  return (
    
    <div className="flex w-full h-screen justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      
        <nav className="mb-4 flex justify-around">
          <button
            onClick={() => setCurrentView("getTransactions")}
            className={`${
              currentView === "getTransactions" ? "font-semibold" : ""
            } text-green-600 hover:text-green-800`}
          >
            Get Transactions
          </button>
          <button
            onClick={() => setCurrentView("verifyTransaction")}
            className={`${
              currentView === "verifyTransaction" ? "font-semibold" : ""
            } text-green-600 hover:text-green-800`}
          >
            Verify Transaction
          </button>
        </nav>

        {currentView === "getTransactions" && (
          <div className="space-y-6">
            <input
              type="text"
              value={blockNumber}
              onChange={(e) => setBlockNumber(e.target.value)}
              placeholder="Enter block number"
              className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:border-green-600"
            />
            <button
              onClick={handleFetchTransactions}
              disabled={!blockNumber || loading}
              className="w-full bg-green-600 text-white font-bold p-3 rounded-lg hover:bg-green-700 transition disabled:bg-green-400"
            >
              {loading ? "Loading..." : "Get Transactions"}
            </button>
            {fetchError && (
              <p className="text-red-600 text-center mt-4">{fetchError}</p>
            )}
            {transactions.length > 0 && (
              <ul className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                {transactions.map((hash, index) => (
                  <li
                    key={index}
                    className="p-2 border border-gray-200 text-black rounded-lg text-xs bg-gray-50 break-all"
                  >
                    {hash}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {currentView === "verifyTransaction" && (
          <div className="space-y-6">
            <input
              type="text"
              value={transactionHash}
              onChange={(e) => {
                setTransactionHash(e.target.value);
                setIsVerified(false);
                setMerkleProof([]);
                setVerificationMessage("");
                setProofNotExist(false);
              }}
              placeholder="Enter transaction hash"
              className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:border-green-600"
            />
            <button
              onClick={handleGenerateMerkleProof}
              disabled={!transactionHash || proofLoading}
              className="w-full bg-green-600 text-white font-bold p-3 rounded-lg hover:bg-green-700 transition disabled:bg-green-400"
            >
              {proofLoading ? "Generating..." : "Generate Proof"}
            </button>
            {proofError && (
              <p className="text-red-600 text-center mt-4">{proofError}</p>
            )}
            {merkleProof.length > 0 && (
              <div className="mt-4 p-4 bg-gray-50 text-black rounded-lg">
                <h3 className="font-semibold text-gray-700">Merkle Proof:</h3>
                <ul className="text-xs break-all">
                  {merkleProof.map((proofItem, index) => (
                    <li key={index}>{proofItem}</li>
                  ))}
                </ul>
                <p className="text-center mt-4">
                  Verification Status:{" "}
                  <span
                    className={isVerified ? "text-green-500" : "text-red-500"}
                  >
                    {isVerified ? "Valid" : "Invalid"}
                  </span>
                </p>
                {verificationMessage !== "" && (
                  <p className="text-center mt-2 text-gray-700">
                    {verificationMessage}
                  </p>
                )}
              </div>
            )}
            {proofNotExist && (
              <div className="mt-4 p-4 bg-yellow-100 text-yellow-900 rounded-lg">
                <span className="flex gap-2">
                  <p className="font-bold">Verification Status:</p>
                  <p className="text-red-500 font-semibold">Invalid</p>
                </span>
                <p className="mt-2">
                  <span className="font-semibold">Merkle Root:</span>{" "}
                  <p>{merkleRoot}</p>
                </p>
                <p className="mt-2">
                  <span className="font-semibold">Merkle Proof:</span>
                  <ul>
                    {merkleProof.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </p>
              </div>
            )}
          </div>
        )}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleReset}
            className="w-full bg-gray-200 text-black font-bold p-3 rounded-lg hover:bg-gray-300 transition"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
