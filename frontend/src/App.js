import { useState, useEffect } from "react";
import { ethers } from "ethers";
import TodoABI from "./TodoABI.json";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  async function connectWallet() {
    if (!window.ethereum) {
      alert("Install MetaMask");
      return;
    }

    const HARDHAT_CHAIN_ID = "0x7a69"; // 31337

    // 1️⃣ Force network switch
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: HARDHAT_CHAIN_ID }],
      });
    } catch (switchError) {

      // Network not added yet
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: HARDHAT_CHAIN_ID,
              chainName: "Hardhat Local",
              rpcUrls: ["http://127.0.0.1:8545"],
              nativeCurrency: {
                name: "ETH",
                symbol: "ETH",
                decimals: 18,
              },
            },
          ],
        });
      } else {
        console.error(switchError);
        return;
      }
    }

    // 2️⃣ Double-check active chain
    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });

    if (chainId !== HARDHAT_CHAIN_ID) {
      alert("Wrong network selected");
      return;
    }

    // 3️⃣ Continue normal connection
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();

    const todoContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      TodoABI.abi,
      signer
    );

    setAccount(await signer.getAddress());
    setContract(todoContract);
  }

  async function loadTasks(todoContract) {
    const data = await todoContract.getTasks();
    setTasks(data);
  }

  async function addTask() {
    if (!input) return;
    const tx = await contract.addTask(input);
    await tx.wait();
    setInput("");
    loadTasks(contract);
  }

  async function toggleTask(id) {
    const tx = await contract.toggleTask(id);
    await tx.wait();
    loadTasks(contract);
  }

  useEffect(() => {
    if (contract) {
      loadTasks(contract);
    }
  }, [contract]);

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h2>Web3 Todo DApp</h2>

      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <p>Connected: {account}</p>
      )}

      {account && (
        <>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="New Task"
          />
          <button onClick={addTask}>Add</button>

          <ul>
            {tasks.map((task, index) => (
              <li key={index}>
                <span
                  style={{
                    textDecoration: task.completed ? "line-through" : "none",
                    cursor: "pointer"
                  }}
                  onClick={() => toggleTask(task.id)}
                >
                  {task.content}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;