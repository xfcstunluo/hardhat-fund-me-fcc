# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```

```
yarn add --dev hardhat-deploy
yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers//使得部署更灵活 

yarn add --dev ethers@^5 降级

yarn hardhat coverage 测试.sol文件的代码被执行的覆盖率
```

```
git init -b main
git add . //后续再推送时，执行1
git commit -m 'initial commit' //执行2
git remote add origin https://github.com/xfcstunluo/hardhat-fund-me-fcc.git
*github现在不用main，而是master。所以出错时要加上：git branch -m master main
git push origin main 执行3
```

```
当项目有多个子系统时，删除各自子系统中的gitignore文件，以及.git隐藏文件夹（直接在文件夹页面删），后执行：
git rm --cached 文件夹名
git add .
git commit -m "commit msg"
git push origin main
```
