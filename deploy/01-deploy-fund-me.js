const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
  //=hre.getNamedAccounts,hre.deployments
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId

  //如果chainId是x 使用喂价地址y
  //如果chainId是z 使用喂价地址A
  //   const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
  //如果所用的链没有喂价地址，那么在本地部署一个最小化模块
  let ethUsdPriceFeedAddress
  //if(本地开发链不存在)else（测试链 主链）
  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator")
    ethUsdPriceFeedAddress = ethUsdAggregator.address
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
  }

  const args = [ethUsdPriceFeedAddress]
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: args, //放入具体喂价合约
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(fundMe.address, args)
  }
  log("--------------")
}

module.exports.tags = ["all", "fundme"]
