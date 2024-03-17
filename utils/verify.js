const { run } = require("hardhat")

const verify = async (contractAddress, args) => {
  console.log("正在进行验证...")
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("已经验证！")
    } else {
      console.log(e)
    }
  }
}

module.exports = { verify }
