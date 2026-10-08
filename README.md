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

The Remix deployment at `0x643cfb9C52c643BeFaBBD0f1234980bc2Fa20891` is configured as the default, so users do not deploy or enter an address. To point your own fork at another contract, copy `frontend/.env.example` to `frontend/.env` and set `REACT_APP_TODO_CONTRACT_ADDRESS`.

## Deploy the frontend to Vercel

Import this repository into Vercel. The root `vercel.json` installs the frontend dependencies, builds the React app from `frontend`, and publishes `frontend/build`. Or deploy from the repository root with the Vercel CLI:

```powershell
npx vercel
npx vercel --prod
```

The shared contract address is included as the default, so Vercel users only need MetaMask on Sepolia to connect and use it. For a fork with a different contract, set `REACT_APP_TODO_CONTRACT_ADDRESS` as a Vercel project environment variable and redeploy. Vercel does not need wallet secrets or an RPC key.

## Contract

`contracts/todo.sol` keeps tasks separately for each wallet. It supports adding, editing, completing, and deleting tasks. Deleted tasks remain on chain and are hidden by the UI.
