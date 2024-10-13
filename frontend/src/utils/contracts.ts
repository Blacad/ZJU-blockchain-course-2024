import Addresses from './contract-addresses.json'
import BuyMyRoom from './abis/BuyMyRoom.json'
import MyERC721 from './abis/MyERC721.json'

const Web3 = require('web3');

// @ts-ignore
// 创建web3实例
// 可以阅读获取更多信息https://docs.metamask.io/guide/provider-migration.html#replacing-window-web3
let web3 = new Web3(window.web3.currentProvider)

// 修改地址为部署的合约地址
const buyMyRoomAddress = Addresses.buyMyRoom
const buyMyRoomABI = BuyMyRoom.abi
const myERC721Address = Addresses.myERC721
const myERC721ABI = MyERC721.abi

// 获取合约实例
const buyMyRoomContract = new web3.eth.Contract(buyMyRoomABI, buyMyRoomAddress);
const myERC721Contract = new web3.eth.Contract(myERC721ABI, myERC721Address);

// 导出web3实例和其它部署的合约
export {web3, buyMyRoomContract, myERC721Contract}