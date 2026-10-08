# Web3 Todo DApp

A React and Solidity todo list that stores each wallet's tasks on Ethereum Sepolia. MetaMask connects, deploys the contract, and signs task transactions.

## Run locally

```powershell
cd frontend
npm ci
npm start
```

Open the local URL shown by React, connect MetaMask, and approve switching to Sepolia. If no contract address is configured, choose **Deploy Todo to Sepolia** and approve the deployment transaction. Sepolia test ETH is required for deployment and task transactions. The address is saved in that browser's local storage.

To use a previously deployed contract, copy `frontend/.env.example` to `frontend/.env` and set `REACT_APP_TODO_CONTRACT_ADDRESS`.

## Deploy the frontend to Vercel

Import this repository into Vercel. The root `vercel.json` installs the frontend dependencies, builds the React app from `frontend`, and publishes `frontend/build`. Or deploy from the repository root with the Vercel CLI:

```powershell
npx vercel
npx vercel --prod
```

If a contract has already been deployed, add `REACT_APP_TODO_CONTRACT_ADDRESS` as a Vercel project environment variable and redeploy. Otherwise, connect MetaMask on the deployed site and deploy the contract there. Vercel does not need wallet secrets or an RPC key.

## Contract

`contracts/todo.sol` keeps tasks separately for each wallet. It supports adding, editing, completing, and deleting tasks. Deleted tasks remain on chain and are hidden by the UI.
