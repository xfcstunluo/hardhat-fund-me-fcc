const { assert, expect } = require("chai")
const { getNamedAccounts, deployments, ethers } = require("hardhat")
const {
  isCallTrace,
} = require("hardhat/internal/hardhat-network/stack-traces/message-trace")

describe("FundMe", () => {
  let fundMe, deployer, mockV3Aggregator
  // const sendValue = "1000000000000000000" //1ETH
  // const sendValue = ethers.utils.parseEther("1")
  //在v6中，函数“parseEther”已从 ethers.utils 迁移到 ethers
  const sendValue = ethers.parseEther("1")
  beforeEach(async function () {
    // deployer = (await getNamedAccounts()).deployer //v5
    deployer = await ethers.provider.getSigner()
    deployerAddress = await deployer.getAddress() //deployer是signer对象，需要获取该签名者关联的地址字符串

    await deployments.fixture(["all"]) // deploy with tags
    fundMe = await ethers.getContractAt(
      "FundMe",
      (await deployments.get("FundMe")).address,
      deployer,
    ) // most recently deployed fundme contract
    mockV3Aggregator = await ethers.getContractAt(
      "MockV3Aggregator",
      (await deployments.get("MockV3Aggregator")).address,
      deployer,
    )
  })

  describe("constructor", () => {
    it("sets the aggregator addresses correctly", async function () {
      const response = await fundMe.priceFeed()
      assert.equal(response, await mockV3Aggregator.getAddress())
    })
  })

  describe("fund", async function () {
    //测试require(msg.value.getConversionRate(priceFeed) >= MINIMUM_USD, "You need to spend more ETH!");
    it("没有支付足够的ETH将失败", async function () {
      await expect(fundMe.fund()).to.be.revertedWith(
        "You need to spend more ETH!",
      )
    })

    //yarn hardhat test --grep "amount funded" 只单独执行该测试，"amount funded"是测试部分名称，让程序知道执行该测试
    //测试 addressToAmountFunded[msg.sender] += msg.value;
    it("updated the amount funded data structure", async function () {
      await fundMe.fund({ value: sendValue })
      const response = await fundMe.addressToAmountFunded(deployer)
      assert.equal(response.toString(), sendValue.toString())
    })

    //测试funders.push(msg.sender);
    it("Add funder to array of funders", async function () {
      await fundMe.fund({ value: sendValue })
      const funder = await fundMe.funders(0)
      assert.equal(funder, deployerAddress)
    })
  })

  describe("withdraw", async function () {
    beforeEach(async function () {
      await fundMe.fund({ value: sendValue })
    })

    it("Withdraw ETH from a single founder", async function () {
      //准备阶段
      const startingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address,
      )
      const startingDeployerBalance =
        await fundMe.provider.getBalance(deployerAddress)

      //执行
      //向一个合约地址拿钱会导致2个账户的变更
      const transactionResponse = await fundMe.withdraw()
      const transactionReceipt = await transactionResponse.wait(1)
      const endingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address,
      )
      const endingDeployerBalance =
        await fundMe.provider.getBalance(deployerAddress)

      //验证
      assert.equal(endingFundMeBalance, 0)
      assert.equal(
        startingDeployerBalance.add(startingFundMeBalance).toString(), //因为是大整数，不用+
        endingDeployerBalance.add(gasCost).toString(),
      )
    })
  })
})
