// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;
// Uncomment the line to use openzeppelin/ERC721,ERC20
// You can use this dependency directly because it has been installed by TA already
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./MyERC721.sol";
// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract BuyMyRoom is IERC721Receiver{
    
    event List(address indexed seller, address indexed nftAddr, uint256 indexed tokenId, uint256 price);
    event Purchase(address indexed buyer, address indexed nftAddr, uint256 indexed tokenId, uint256 price);
    event Revoke(address indexed seller, address indexed nftAddr, uint256 indexed tokenId);    
    event Update(address indexed seller, address indexed nftAddr, uint256 indexed tokenId, uint256 newPrice);
    MyERC721 public myERC721;
    struct House {
        address owner;
        uint256 price;
        uint256 listedTimestamp;
    }
    
    mapping(address =>mapping(uint256 => House)) public houses_list; // 合约地址和tokenid 来标识挂单房子，总挂单的房子
    
     fallback() external payable {}
     constructor() {
        myERC721 = new MyERC721("House", "HouseSymbol");
    }
     function list(address _nftAddr, uint256 _tokenId, uint256 _price) public{
        IERC721 _nft = IERC721(_nftAddr); // 声明IERC721接口合约变量
        require(_nft.getApproved(_tokenId) == address(this), "Need Approval"); // 合约得到授权
        require(_price > 0); // 价格大于0
        House storage _house = houses_list[_nftAddr][_tokenId]; //设置NF持有人和价格
        _house.owner = msg.sender;
        _house.price = _price;
        _house.listedTimestamp = block.timestamp;
        // 将NFT转账到合约
        _nft.safeTransferFrom(msg.sender, address(this), _tokenId);
        // 释放List事件
        emit List(msg.sender, _nftAddr, _tokenId, _price);
    }
      // 购买: 买家购买NFT，合约为_nftAddr，tokenId为_tokenId，调用函数时要附带ETH
    function purchase(address _nftAddr, uint256 _tokenId) public payable {
        House storage _house = houses_list[_nftAddr][_tokenId]; // 取得House
        require(_house.price > 0, "Invalid Price"); // NFT价格大于0
        require(msg.value >= _house.price, "Increase price"); // 购买价格大于标价
        // 声明IERC721接口合约变量
        IERC721 _nft = IERC721(_nftAddr);
        require(_nft.ownerOf(_tokenId) == address(this), "Invalid Order"); // NFT在合约中

        // 将NFT转给买家
        _nft.safeTransferFrom(address(this), msg.sender, _tokenId);
        // 将ETH转给卖家，多余ETH给买家退款
        payable(_house.owner).transfer(_house.price);
        payable(msg.sender).transfer(msg.value - _house.price);

        delete houses_list[_nftAddr][_tokenId]; // 删除order

        // 释放Purchase事件
        emit Purchase(msg.sender, _nftAddr, _tokenId, _house.price);
    }
    // 撤单： 卖家取消挂单
    function revoke(address _nftAddr, uint256 _tokenId) public {
        House storage _house = houses_list[_nftAddr][_tokenId];// 取得House
        require(_house.owner == msg.sender, "Not Owner"); // 必须由持有人发起
        // 声明IERC721接口合约变量
        IERC721 _nft = IERC721(_nftAddr);
        require(_nft.ownerOf(_tokenId) == address(this), "Invalid Order"); // NFT在合约中

        // 将NFT转给卖家
        _house.listedTimestamp = 0;
        _nft.safeTransferFrom(address(this), msg.sender, _tokenId);
        delete houses_list[_nftAddr][_tokenId]; // 删除order

        // 释放Revoke事件
        emit Revoke(msg.sender, _nftAddr, _tokenId);
    }
    // 调整价格: 卖家调整挂单价格
    function update(address _nftAddr,uint256 _tokenId,uint256 _newPrice) public {
        require(_newPrice > 0, "Invalid Price"); // NFT价格大于0
        House storage _house = houses_list[_nftAddr][_tokenId];// 取得House
        require(_house.owner == msg.sender, "Not Owner"); // 必须由持有人发起
        // 声明IERC721接口合约变量
        IERC721 _nft = IERC721(_nftAddr);
        require(_nft.ownerOf(_tokenId) == address(this), "Invalid Order"); // NFT在合约中
        // 调整NFT价格
        _house.price = _newPrice;
        // 释放Update事件
        emit Update(msg.sender, _nftAddr, _tokenId, _newPrice);
    }
    function helloworld() pure external returns(string memory) {
        return "hello world";
    }
    function getHouse(address _nftAddr, uint256 _tokenId) public view returns(address,uint256,uint256) {
        House storage _house = houses_list[_nftAddr][_tokenId];
        return (_house.owner,_house.price,_house.listedTimestamp);
    }
    // 实现{IERC721Receiver}的onERC721Received,能够接收ERC721代币
    function onERC721Received(
        address operator,
        address from,
        uint tokenId,
        bytes calldata data
    ) external override returns (bytes4){
        return IERC721Receiver.onERC721Received.selector;
    }
}