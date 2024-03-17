const { network } = require("hardhat")
const {
  developmentChains,
  DECIMALS,
  INITIAL_ANSWER,
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
  //=hre.getNamedAccounts,hre.deployments
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId

  if (developmentChains.includes(network.name)) {
    log("找到本地网络，deploying mocks...")
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true, //输出详细信息
      args: [DECIMALS, INITIAL_ANSWER],
    })
    log("Mocks deployed")
    log("--------------")
  }
}

//只部署该脚本
//yarn hardhat deploy --tags mocks
module.exports.tags = ["all", "mocks"]
