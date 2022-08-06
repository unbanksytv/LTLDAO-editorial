// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract ERC20Token is ERC20 {
    constructor() ERC20("Simple Token", "SIM") {
        _mint(msg.sender, 1000000 * (10**uint256(decimals())));
        console.log("[LOG] Simple token created");
    }
}
