# ZJU-blockchain-course-2024
# 房屋买卖网站

## 项目架构和介绍

- 项目架构
    - 后端使用框架 hardhat 语言 Solidity
    - 前端使用框架 React 语言 html、css、Javascript
- 项目介绍
我们要实现一个基于ERC721与NFT的房屋买卖网站
![alt text](<assets/Pasted image 20241013165520.png>)


## 如何运行

1. 在本地启动ganache应用。

2. 在 `./contracts` 中安装需要的依赖，运行如下的命令：
    ```bash
    npm install
    ```
3. 在 `./contracts/hardhat.config.ts` 中将账户改成您自己测试环境中的账户地址，保证您的ganache中的端口号与本程序一致
4. 在 `./contracts` 中编译合约，运行如下的命令：
    ```bash
    npx hardhat compile
    ```
5. 在后端文件夹`./contracts`中部署合约到自己的测试区块链环境中，运行如下的命令：
    ```bash
    npx hardhat run scripts/deploy.ts --network ganache
    ```
6. 我在部署文件中添加了打印部署地址的功能，记录部署的合约地址，然后在`./frontend/src/utils/contract-address.json`中将地址改为您运行生成的地址，接着需要将后端编译生成的`./contracts/artifacts/contracts/BuyMyRoom.sol/BuyMyRoom.json`和`./contracts/artifacts/contracts/MyERC721.sol/MyERC721.json` 复制到前端的`./frontend/src/utils/abis`中
7. 在 `./frontend` 中安装需要的依赖，运行如下的命令：
    ```bash
    npm install
    ```
8. 在 `./frontend` 中启动前端程序，运行如下的命令：
    ```bash
    npm run start
    ```

## 功能实现分析

1. 实现了用户可以将房屋指定一定的价格，然后挂单给平台出售。
这个具体的实现方式：为了规范，我们先通过我们ERC721的地址得到我们ERC721的接口，接着，检测是否该NFT被授权给智能合约的地址，或者说平台的地址，再接着检测设定的房屋售价是否大于0，再接着配置挂单房屋的基本信息，比如拥有者的地址、挂单时的价格、挂单时间，并将其记录在挂单房屋的列表中，最后通过ERC721的接口将NFT转交给平台，具体代码如图：
![alt text](<assets/Pasted image 20241015172033.png>)

2. 实现了用户可以将自己的挂单房屋撤回的功能。
这个的具体实现方式，为了规范，我们先通过我们ERC721的地址得到我们ERC721的接口，接着，检测是否撤回的发起者是房屋的拥有者，接着检查该房屋是否在平台，再接着，平台将房屋还给用户并在挂单的房产列表中将它删除，具体代码如图：
![alt text](<assets/image.png>)

3. 实现了用户可以购买别人挂单房屋的功能并且允许平台根据挂单时间收取费用，但是保证平台收取的费用不会超过房产挂单价格的10%。
这个的具体实现方式，为了规范，我们先通过我们ERC721的地址得到我们ERC721的接口，接着，检测挂单房屋的价格是否大于0，再接着，根据挂单的时间和我设定的公式来结算应支付给平台的费用，我们通过公式保证平台收取的费用不会超过房产挂单价格的10%，再接着，检查用户支付的费用是否能够支付房屋的挂单价格和应支付给平台的费用，再接着，平台将房屋给购买者，紧接着，我们将房屋挂单的费用支付给房屋原来的拥有者，将应支付给平台的费用支付给平台，该平台是部署合约者，它在构造函数中能够体现，接着将剩余的钱还给支付者，最后将房屋从挂单房产列表中删除，具体代码如图
![alt text](<assets/Pasted image 20241015172110.png>)

4. 实现了用户可以查看挂单房屋的基本信息。
这个的具体实现方法，当我们挂单房屋时，我们只会要求用户输入挂单价格，然后我们还会生成一些数据，比如挂单的时刻、该房屋的拥有者、该房屋代表的NFT等，然后通过House的结构体将这些内容保存并以NFT作为唯一标识，并且我们向前端返回房子的信息，具体代码如图
![alt text](<assets/Pasted image 20241015172333.png>)

5. 实现了用户可以看到自己未挂单的房产和挂单的房产，以及其它人挂单的房产即挂单房产列表和自己的未挂单房产列表来方便操作。
具体的实现方法，首先我们需要向前端返回所有NFT的数量，然后如同UTXO模型一样，我们在前端会根据用户的地址寻找用户未挂单的房产，同时由于挂单的房产本质上是用户已经将房产给了平台，因此我们根据平台的地址就可以得到所有的挂单房产，进一步我们根据后端返回的挂单房屋信息得知挂单房屋的拥有者，这样就能够让用户分辨哪些是自己未挂单的房产，哪些是已挂单的房产，哪些是其它用户挂单的房产，进而进行不同的操作，对自己未挂单的房产可以挂单，对已挂单的房产可以撤单，对其它用户挂单的房产可以购买，有关的代码，如图
![alt text](<assets/Pasted image 20241015110340.png>)
![alt text](<assets/Pasted image 20241015172333.png>)

6. 实现了用户将NFT授权给平台后才能挂单的机制。
实现方法，根据NFT的规范，我们必须将NFT授权给某个地址后，那个地址才能够操作该NFT，进行NFT的交易，因此我们添加了授权的机制，并且在对NFT操作时都要检测该地址是否被授权过该NFT，该授权代码由ERC721的默认接口提供。

7. 实现了用户可以通过空投获得房屋。
实现方法，我们实现了空投的机制，让用户点击得到房产的按钮后，就会空投给该用户一个房产，具体代码如图
![alt text](<assets/Pasted image 20241014135107.png>)



## 项目运行截图

1. 首先启动ganache，如图
![alt text](<assets/image1.png>)

2. 请根据*如何运行项目*部分将项目配置好，我这里已经部署过了，因此只是贴出部署好项目后的界面，如果部署成功应该会新增一条交易，我的该区块链已经交易过多次了因此才会显示如此多次的交易，如图
![alt text](<assets/image2.png>)

3. 接着，我们根据*如何运行项目*部分配置好前端，然后执行`npm run start`,如图
![alt text](<assets/IMG_2275.jpg>)

4. 再接着，我们会跳转到对应的网页上去，我们登陆自己的钱包，然后添加几个我们测试区块链的账户到钱包中，并让它们连接进入网络，如图
![alt text](<assets/image-1.png>)

5. 再接着，我们刷新网络就能够在网页上显示该用户了，如图
![alt text](<assets/image-2.png>)

6. 再接着，我们点击账户的按钮就可以欢迎账户登陆并显示详细的信息，图中房屋市场没有表示目前没有挂单的房屋，如图
![alt text](<assets/image-3.png>)

7. 再接着，我们让用户授权并挂单自己的房屋，刷新页面并在此点击账户，可以看到房屋已挂单，并且可以看到挂单的一些信息比如挂单价格、房屋拥有者、房屋挂单时刻等，如图
- 挂单
![alt text](<assets/image-4.png>)
- 挂单访问钱包
![alt text](<assets/image-5.png>)
- 挂单成功
![alt text](<assets/image-6.png>)

8. 再接着，我们让用户撤单自己挂单的房屋，刷新页面并在此点击账户，可以看到房屋已撤单，如图
- 撤单访问钱包
![alt text](<assets/image-7.png>)
- 撤单成功
![alt text](<assets/image-3.png>)

9. 再接着，我们让用户挂出自己的房屋，并让另一个用户来购买，如图
- 购买
![alt text](<assets/image-8.png>)
- 购买访问钱包
![alt text](<assets/image-9.png>)
- 购买成功
![alt text](<assets/image-10.png>)

10. 再接着，我们让用户通过空投得到房产，如图
- 空投访问钱包
![alt text](<assets/image-11.png>)
- 空投成功
![alt text](<assets/image-12.png>)

## 参考内容

- 课程的参考Demo见：[DEMOs](https://github.com/LBruyne/blockchain-course-demos)。

- 快速实现 ERC721 和 ERC20：[模版](https://wizard.openzeppelin.com/#erc20)。记得安装相关依赖 ``"@openzeppelin/contracts": "^5.0.0"``。

- 如何实现ETH和ERC20的兑换？ [参考讲解](https://www.wtf.academy/en/docs/solidity-103/DEX/)

- WTF [参考](https://www.wtf.academy/docs/solidity-101/)
