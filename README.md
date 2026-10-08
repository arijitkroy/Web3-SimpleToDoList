# Web3 Todo DApp

A React and Solidity todo list that stores each wallet's tasks on Ethereum Sepolia. Deploy the contract with Remix IDE, then connect the app to it with MetaMask.

## Run locally

```powershell
cd frontend
npm ci
npm start
```

### Deploy the contract with Remix

1. Open `contracts/todo.sol` in Remix and compile it with Solidity **0.8.20**.
2. In **Deploy & Run Transactions**, select **Injected Provider - MetaMask** and switch MetaMask to **Sepolia**.
3. Select the `Todo` contract, click **Deploy**, and approve the transaction in MetaMask. Keep the deployed contract address.

Sepolia test ETH is required to deploy the contract and send task transactions.

### Connect the app

Open the local URL shown by React, connect MetaMask on Sepolia, paste the deployed contract address, and select **Connect to Contract**. The address is saved in that browser's local storage.

To use a previously deployed contract, copy `frontend/.env.example` to `frontend/.env` and set `REACT_APP_TODO_CONTRACT_ADDRESS`.

## Deploy the frontend to Vercel

Import this repository into Vercel. The root `vercel.json` installs the frontend dependencies, builds the React app from `frontend`, and publishes `frontend/build`. Or deploy from the repository root with the Vercel CLI:

```powershell
npx vercel
npx vercel --prod
```

After deploying the contract with Remix, add `REACT_APP_TODO_CONTRACT_ADDRESS` as a Vercel project environment variable and redeploy. Or leave it unset and paste the address in the app after connecting MetaMask. Vercel does not need wallet secrets or an RPC key.

## Contract

`contracts/todo.sol` keeps tasks separately for each wallet. It supports adding, editing, completing, and deleting tasks. Deleted tasks remain on chain and are hidden by the UI.
