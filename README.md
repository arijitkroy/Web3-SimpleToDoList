# Web3 Todo DApp

A React and Solidity todo list that stores each wallet's tasks on Ethereum Sepolia.

## Live app

[Open BlockMemo on Vercel](https://blockmemo.vercel.app/). Connect MetaMask on Sepolia to use the shared deployed contract. Users do not need to deploy a contract or enter its address.

## Run locally

```powershell
cd frontend
npm ci
npm start
```

### Deploy your own contract with Remix (optional)

1. Open `contracts/todo.sol` in Remix and compile it with Solidity **0.8.20**.
2. In **Deploy & Run Transactions**, select **Injected Provider - MetaMask** and switch MetaMask to **Sepolia**.
3. Select the `Todo` contract, click **Deploy**, and approve the transaction in MetaMask. Keep the deployed contract address.

Sepolia test ETH is required to deploy the contract and send task transactions.

The shared Remix deployment at `0x643cfb9C52c643BeFaBBD0f1234980bc2Fa20891` is configured as the default. To use your own deployment in a local copy, copy `frontend/.env.example` to `frontend/.env` and set `REACT_APP_TODO_CONTRACT_ADDRESS`; connect MetaMask, enter the address if prompted, then choose **Connect to Contract**.

## Deploy the frontend to Vercel

Import this repository into Vercel. The root `vercel.json` installs the frontend dependencies, builds the React app from `frontend`, and publishes `frontend/build`. Or deploy from the repository root with the Vercel CLI:

```powershell
npx vercel
npx vercel --prod
```

The shared contract address is included as the default, so Vercel users only need MetaMask on Sepolia to connect and use it. For a fork with a different contract, set `REACT_APP_TODO_CONTRACT_ADDRESS` as a Vercel project environment variable and redeploy. Vercel does not need wallet secrets or an RPC key.

## Contract

`contracts/todo.sol` keeps tasks separately for each wallet. It supports adding, editing, completing, and deleting tasks. Deleted tasks remain on chain and are hidden by the UI.
