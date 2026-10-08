# Web3 Todo DApp

A React and Solidity todo list that stores each wallet's tasks on Ethereum Sepolia. MetaMask connects, deploys the contract when needed, and signs task transactions.

## Requirements

- Node.js 18 or newer
- MetaMask with Sepolia enabled
- Sepolia test ETH for deployment and task transactions

## Run the app

```powershell
npm install
cd frontend
npm install
npm start
```

Open the local URL shown by React, select **Connect Wallet**, and approve the Sepolia network/account in MetaMask. If the contract has not been deployed for this app, choose **Deploy Todo to Sepolia** and confirm the deployment transaction. The address is saved in this browser's local storage. You can also set `REACT_APP_TODO_CONTRACT_ADDRESS` in `frontend/.env` to use a known deployment address.

## Deploy the frontend to Vercel

Import this repository into Vercel. The root `vercel.json` installs the frontend dependencies, builds the React app from `frontend`, and publishes `frontend/build`. You can also deploy from the repository root with the Vercel CLI:

```powershell
npx vercel
npx vercel --prod
```

If you have already deployed the Todo contract, add `REACT_APP_TODO_CONTRACT_ADDRESS` as a Vercel project environment variable and redeploy. Otherwise, connect MetaMask on the deployed site and deploy the contract through the app. Contract deployment and task transactions are signed in the user's wallet; Vercel does not need wallet secrets or an RPC key.

## Deploy using Hardhat (optional)

The app's deploy button deploys through MetaMask. For command-line deployment, configure a Sepolia RPC endpoint and a dedicated test wallet key in the root `.env`:

```env
SEPOLIA_RPC_URL=https://your-sepolia-rpc-url
DEPLOYER_PRIVATE_KEY=0xyour_test_wallet_private_key
```

Keep `.env` private and never commit a wallet key. Then run:

```powershell
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

Set the printed address as `REACT_APP_TODO_CONTRACT_ADDRESS` in `frontend/.env` if you want the app to use that deployment. The browser deployment flow does not need an RPC key or private key.

## Contract

`contracts/todo.sol` keeps tasks separately for each wallet. It supports adding, editing, completing, and deleting tasks. Deleted tasks remain on chain and are hidden by the UI.
