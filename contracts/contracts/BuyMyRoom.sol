// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;
// You can use this dependency directly because it has been installed by TA already
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./MyERC721.sol";
// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract BuyMyRoom is IERC721Receiver{
    // 事件
    event List(address indexed seller, address indexed nftAddr, uint256 indexed tokenId, uint256 price);
    event Purchase(address indexed buyer, address indexed nftAddr, uint256 indexed tokenId, uint256 price);
    event Revoke(address indexed seller, address indexed nftAddr, uint256 indexed tokenId);    
    MyERC721 public myERC721;
    struct House {
        address owner;
        uint256 price;
        uint256 listedTimestamp;
    }
    address public _platform;
    mapping(address =>mapping(uint256 => House)) public houses_list; // ERC721合约地址和tokenid 来标识挂单房子，总挂单的房子
    
     fallback() external payable {}
     constructor() {
        myERC721 = new MyERC721("House", "HouseSymbol");
        _platform = msg.sender;
    }
    //挂单房产
     function list(address _nftAddr, uint256 _tokenId, uint256 _price) public{
        // 声明IERC721接口合约变量
        IERC721 _nft = IERC721(_nftAddr); 
         // 检验 buyMyRoom 合约是否已经被授权
        require(_nft.getApproved(_tokenId) == address(this), "No Approval for our platform"); 
        // 房子的售价大于0
        require(_price > 0); 
        House storage _house = houses_list[_nftAddr][_tokenId]; 
        //指定房屋的各项属性完成NFT与房屋的绑定
        _house.owner = msg.sender;
        _house.price = _price;
        _house.listedTimestamp = block.timestamp;
        // 将房产本交给平台管理，此时通过 houses_list 来标识该房子的主人是谁，但是实际的房产本在平台
        _nft.safeTransferFrom(msg.sender, address(this), _tokenId);
        emit List(msg.sender, _nftAddr, _tokenId, _price);
    }
    // 购买房产
    function purchase(address _nftAddr, uint256 _tokenId) public payable {
        House storage _house = houses_list[_nftAddr][_tokenId]; // 取得House
        // 检测挂单房产的价格需要大于0
        require(_house.price > 0, "Price 0 is invalid price"); 
        //小费基于挂单时间和设置的房产价格来决定,分母确保小费不会大于房产价格的1/10,挂单每m个月后 房产m/（10m+1）的价格为小费
        uint priceforme = _house.price*(block.timestamp - _house.listedTimestamp)/(2592000+(block.timestamp - _house.listedTimestamp)*10);
        // 购买价格需要大于总价即房产价格与小费
        require(msg.value >= _house.price+priceforme, "Price is not enough"); 
        // 声明IERC721接口合约变量
        IERC721 _nft = IERC721(_nftAddr);
        //检测该房产的房产本是否在合约中
        require(_nft.ownerOf(_tokenId) == address(this), "The house cannot be found in the contract"); 
        // 将房产转给买家
        _nft.safeTransferFrom(address(this), msg.sender, _tokenId);
        // 将房产的ETH转给卖家，小费的ETH转给平台，多余ETH给买家退款
        payable(_house.owner).transfer(_house.price);
        payable(_platform).transfer(priceforme);
        payable(msg.sender).transfer(msg.value - _house.price-priceforme);
        // 将房子从挂单列表中撤除
        delete houses_list[_nftAddr][_tokenId]; 
        emit Purchase(msg.sender, _nftAddr, _tokenId, _house.price);
    }
    // 撤单房产：卖家取消挂单
    function revoke(address _nftAddr, uint256 _tokenId) public {
        // 取得House的信息
        House storage _house = houses_list[_nftAddr][_tokenId];
        // 必须是房子的主人发起撤单请求
        require(_house.owner == msg.sender, "Not Owner"); 
        // 声明IERC721接口合约变量
        IERC721 _nft = IERC721(_nftAddr);
         //检测该房产的房产本是否在合约中
        require(_nft.ownerOf(_tokenId) == address(this), "The house cannot be found in the contract"); 
        // 将房产本还给卖家并将
        _nft.safeTransferFrom(address(this), msg.sender, _tokenId);
        delete houses_list[_nftAddr][_tokenId]; 
        emit Revoke(msg.sender, _nftAddr, _tokenId);
    }
    // 该函数可以视作欢迎函数，主要用来欢迎用户登陆
    function helloworld() pure external returns(string memory) {
        return "Hello! ";
    }
    // 获取房产信息，该函数的主要目的是向前端返回房产的信息方便用户查询
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