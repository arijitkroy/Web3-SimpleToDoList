import { useState, useEffect } from "react";
import { ethers } from "ethers";
import TodoABI from "./TodoABI.json";
import "./App.css";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

/* ── Inline SVG Icons ────────────────────────────── */
const Icons = {
  chain: (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="url(#iconGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <rect x="1" y="5" width="8" height="14" rx="4" />
      <rect x="15" y="5" width="8" height="14" rx="4" />
      <line x1="9" y1="12" x2="15" y2="12" />
    </svg>
  ),
  check: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  edit: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  trash: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  ),
  plus: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
};

function truncateAddress(addr) {
  return addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : "";
}

function formatTimestamp(ts) {
  if (!ts) return "";
  const date = new Date(Number(ts) * 1000);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  async function connectWallet() {
    if (!window.ethereum) {
      alert("Install MetaMask to continue");
      return;
    }

    setLoading(true);
    setLoadingMsg("Connecting wallet…");

    const HARDHAT_CHAIN_ID = "0x7a69"; // 31337

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: HARDHAT_CHAIN_ID }],
      });
    } catch (switchError) {
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
        setLoading(false);
        return;
      }
    }

    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });

    if (chainId !== HARDHAT_CHAIN_ID) {
      alert("Wrong network selected");
      setLoading(false);
      return;
    }

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
    setLoading(false);
  }

  async function loadTasks(todoContract) {
    const data = await todoContract.getTasks();
    setTasks(data);
  }

  async function addTask() {
    if (!input.trim()) return;
    setLoading(true);
    setLoadingMsg("Sending transaction…");
    try {
      const tx = await contract.addTask(input.trim());
      setLoadingMsg("Waiting for confirmation…");
      await tx.wait();
      setInput("");
      await loadTasks(contract);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  async function toggleTask(id) {
    setLoading(true);
    setLoadingMsg("Updating task…");
    try {
      const tx = await contract.toggleTask(id);
      setLoadingMsg("Waiting for confirmation…");
      await tx.wait();
      await loadTasks(contract);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  async function deleteTask(id) {
    if (!window.confirm("Delete this task permanently?")) return;
    setLoading(true);
    setLoadingMsg("Deleting task…");
    try {
      const tx = await contract.deleteTask(id);
      setLoadingMsg("Waiting for confirmation…");
      await tx.wait();
      await loadTasks(contract);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  function startEditing(task) {
    setEditingId(Number(task.id));
    setEditingText(task.content);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditingText("");
  }

  async function saveEdit(id) {
    if (!editingText.trim()) return;
    setLoading(true);
    setLoadingMsg("Saving edit…");
    try {
      const tx = await contract.editTask(id, editingText.trim());
      setLoadingMsg("Waiting for confirmation…");
      await tx.wait();
      setEditingId(null);
      setEditingText("");
      await loadTasks(contract);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") addTask();
  }

  function handleEditKeyDown(e, id) {
    if (e.key === "Enter") saveEdit(id);
    if (e.key === "Escape") cancelEditing();
  }

  useEffect(() => {
    if (contract) {
      loadTasks(contract);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract]);

  const activeTasks = tasks.filter((t) => !t.deleted);
  const completedCount = activeTasks.filter((t) => t.completed).length;
  const pendingCount = activeTasks.length - completedCount;

  return (
    <div className="app-container">
      {/* Loading Overlay */}
      {loading && (
        <div className="spinner-overlay">
          <div className="spinner" />
          <p className="spinner-text">{loadingMsg}</p>
        </div>
      )}

      {/* Header */}
      <header className="app-header">
        <div className="app-logo">{Icons.chain}</div>
        <h1 className="app-title">Web3 Todo</h1>
        <p className="app-subtitle">Your tasks, on-chain & unstoppable</p>

        {account && (
          <div className="wallet-badge">
            <span className="wallet-dot" />
            {truncateAddress(account)}
          </div>
        )}
      </header>

      {/* Connect Wallet */}
      {!account && (
        <div className="connect-section">
          <button
            className="connect-btn"
            onClick={connectWallet}
            disabled={loading}
          >
            Connect Wallet
          </button>
          <p className="metamask-hint">Requires MetaMask on Hardhat network</p>
        </div>
      )}

      {/* Main Content (after connection) */}
      {account && (
        <>
          {/* Stats */}
          {activeTasks.length > 0 && (
            <div className="stats-bar">
              <div className="stat-chip">
                <div className="stat-value">{activeTasks.length}</div>
                <div className="stat-label">Total</div>
              </div>
              <div className="stat-chip">
                <div className="stat-value">{pendingCount}</div>
                <div className="stat-label">Pending</div>
              </div>
              <div className="stat-chip">
                <div className="stat-value">{completedCount}</div>
                <div className="stat-label">Done</div>
              </div>
            </div>
          )}

          {/* Add Task Input */}
          <div className="glass-card task-input-section">
            <div className="input-row">
              <input
                className="task-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What do you need to do?"
                disabled={loading}
              />
              <button
                className="add-btn"
                onClick={addTask}
                disabled={loading || !input.trim()}
              >
                {Icons.plus}
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Task List */}
          {activeTasks.length > 0 ? (
            <div className="glass-card task-list-section">
              <div className="task-list-header">
                <span className="task-list-title">Tasks</span>
                <span className="task-count">
                  {completedCount}/{activeTasks.length} done
                </span>
              </div>

              {activeTasks.map((task, index) => (
                <div
                  key={index}
                  className={`task-item ${task.completed ? "completed" : ""} ${
                    editingId === Number(task.id) ? "editing" : ""
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Checkbox */}
                  <div
                    className="task-checkbox"
                    onClick={() => toggleTask(task.id)}
                  >
                    <span className="check-icon">{Icons.check}</span>
                  </div>

                  {/* Content area */}
                  {editingId === Number(task.id) ? (
                    <div className="task-edit-area">
                      <input
                        className="edit-input"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={(e) => handleEditKeyDown(e, task.id)}
                        autoFocus
                      />
                      <div className="edit-actions">
                        <button
                          className="edit-save-btn"
                          onClick={() => saveEdit(task.id)}
                          disabled={!editingText.trim()}
                        >
                          Save
                        </button>
                        <button
                          className="edit-cancel-btn"
                          onClick={cancelEditing}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        className="task-content"
                        onClick={() => toggleTask(task.id)}
                      >
                        <div className="task-text">{task.content}</div>
                        <div className="task-date">
                          {formatTimestamp(task.createdAt)}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="task-actions">
                        <button
                          className="action-btn edit-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(task);
                          }}
                          title="Edit task"
                        >
                          {Icons.edit}
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTask(task.id);
                          }}
                          title="Delete task"
                        >
                          {Icons.trash}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-title">No tasks yet</div>
              <div className="empty-subtitle">
                Add your first on-chain task above
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;