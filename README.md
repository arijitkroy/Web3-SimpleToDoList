# Web3 Todo DApp

A simple decentralized Todo List built using:

- Solidity
- Hardhat
- Ethers.js (v6)
- React
- MetaMask

This project demonstrates full-stack Web3 development using a local Hardhat blockchain.

---

# Project Structure

```
ToDoList/
│
├── contracts/
│   └── Todo.sol
│
├── scripts/
│   └── deploy.js
│
├── frontend/
│   └── React App
│
├── hardhat.config.js
├── package.json
└── README.md
```

---

# Features

- Connect wallet using MetaMask
- Add tasks (stored on-chain)
- Toggle tasks
- Fetch tasks per wallet
- Local blockchain development with Hardhat

---

# Prerequisites

- Node.js (v18+ recommended)
- MetaMask browser extension
- Git (optional)

---

# Backend Setup (Hardhat)

## 1️. Install Dependencies

```bash
npm install
```

If setting up from scratch:

```bash
npm init -y
npm install --save-dev hardhat@^2.22.0
npm install --save-dev @nomicfoundation/hardhat-toolbox
```

---

## 2️. Compile Smart Contract

```bash
npx hardhat compile
```

---

## 3️. Start Local Blockchain

```bash
npx hardhat node
```

This starts a local Ethereum network at:

```
http://127.0.0.1:8545
Chain ID: 31337
```

---

## 4️. Deploy Contract

Open a new terminal:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

You will get:

```
Todo deployed to: 0x...
```

Copy this address.

---

# MetaMask Setup

## 1️. Add Hardhat Network

Network Name: Hardhat Local  
RPC URL: http://127.0.0.1:8545  
Chain ID: 31337  
Currency Symbol: ETH  

## 2️. Import Hardhat Account

Copy one private key from the Hardhat node terminal and import it into MetaMask.

You should see 10,000 ETH.

---

# Frontend Setup (React)

Navigate to frontend:

```bash
cd frontend
npm install
npm start
```

---

## Update Contract Address

Inside:

```
frontend/src/App.js
```

Replace:

```js
const CONTRACT_ADDRESS = "PASTE_DEPLOYED_ADDRESS";
```

With your actual deployed contract address.

---

## Copy ABI

Copy ABI from:

```
artifacts/contracts/Todo.sol/Todo.json
```

Paste into:

```
frontend/src/TodoABI.json
```

---

# Network Forcing (Important)

The app programmatically forces MetaMask to switch to:

```
Chain ID: 31337 (0x7a69)
```

This prevents accidental interaction with Sepolia or Mainnet.

---

# Smart Contract Overview

```solidity
struct Task {
    uint256 id;
    string content;
    bool completed;
    uint256 createdAt;
}
```

Each wallet has its own task list:

```
mapping(address => Task[]) private tasks;
```

Core functions:

- `addTask(string)`
- `toggleTask(uint256)`
- `getTasks()`

---

# How It Works

1. User connects MetaMask
2. DApp switches to Hardhat network
3. User adds task
4. Transaction is signed
5. Task stored on-chain
6. UI fetches updated state

---

# Test via Hardhat Console

```bash
npx hardhat console --network localhost
```

```js
const Todo = await ethers.getContractFactory("Todo");
const todo = await Todo.attach("DEPLOYED_ADDRESS");

await todo.addTask("Test Task");
await todo.getTasks();
```

---

# Common Issues

### 1. "Interaction with malicious address"
→ Wrong network selected (likely Sepolia)

Fix:
- Switch to Hardhat Local
- Ensure chainId = 0x7a69

### 2. Contract address undefined
→ Deployment script not updated for ethers v6

Use:

```js
await todo.waitForDeployment();
const address = await todo.getAddress();
```

### 3. Tasks not updating
→ Ensure `await tx.wait()` is used

---

# Next Improvements

- Add loading indicators
- Add task deletion
- Improve UI with Tailwind
- Deploy to Sepolia
- Add tests
- Optimize gas usage

---

# Tech Stack Versions

- Hardhat 2.x
- Ethers 6.x
- Solidity 0.8.20
- React 18+

---

# License

MIT