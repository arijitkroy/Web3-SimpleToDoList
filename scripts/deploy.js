const hre = require("hardhat");

async function main() {
  const Todo = await hre.ethers.getContractFactory("Todo");

  const todo = await Todo.deploy();

  await todo.waitForDeployment();

  console.log("Deployment transaction hash:", todo.deploymentTransaction().hash);

  const address = await todo.getAddress();

  console.log("Todo deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});