// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyERC721 is ERC721{
    uint public constant MAX_NTF = 100; // 总量
    uint public TOKEN_ID = 0;
    mapping (address => uint[MAX_NTF]) public Houses;//未挂出的房子
    // 构造函数
    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_){
    }
    // 铸造函数
    function mint(address to) external {
        require(TOKEN_ID >= 0 && TOKEN_ID < MAX_NTF, "NFT run out");
        _mint(to, TOKEN_ID);
        Houses[to][TOKEN_ID] = TOKEN_ID;
        TOKEN_ID++;
    }
    function getTotalid() public view returns(uint){
        return TOKEN_ID;
    }
}
