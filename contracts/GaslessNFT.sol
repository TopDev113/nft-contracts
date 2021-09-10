// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import './AvatarNFT.sol';

contract GaslessNFT is AvatarNFT {

    uint256 constant GAS_TRANSFER = 21000;
    uint256 constant GAS_OFFSET = 0; // 10571;

    constructor() AvatarNFT(
        0.1 ether, 10000, 100, 20,
        "https://metadata.buildship.dev/api/token/GASFREE/", "GaslessClub", "GASFREE"
    ) {}

    // Same as reference implementation
    // function mint(uint256 _nbTokens) override external payable whenSaleStarted {
    //     uint256 supply = totalSupply();
    //     require(_nbTokens < 21, "You cannot mint more than 20 Tokens at once!");
    //     require(supply + _nbTokens <= MAX_SUPPLY - _reserved, "Not enough Tokens left.");
    //     require(_nbTokens * _price <= msg.value, "Inconsistent amount sent!");

    //     for (uint256 i; i < _nbTokens; i++) {
    //         _safeMint(msg.sender, supply + i);
    //     }
    // }

    function mintFree(uint256 _nbTokens) external payable whenSaleStarted {
        uint256 gasStart;

        gasStart = gasleft();

        uint256 supply = totalSupply();
        require(_nbTokens <= MAX_TOKENS_PER_MINT, "You cannot mint more than 20 Tokens at once!");
        require(supply + _nbTokens <= MAX_SUPPLY - _reserved, "Not enough Tokens left.");
        require(_nbTokens * _price <= msg.value, "Inconsistent amount sent!");

        for (uint256 i; i < _nbTokens; i++) {
            _safeMint(msg.sender, supply + i);
        }

        uint256 cashback = (gasStart + GAS_TRANSFER + GAS_OFFSET) * block.basefee;

        cashback = cashback - gasleft() * block.basefee;

        require(cashback * 2 <= msg.value, "Max cashback 50%");

        // payable().send(cashback);
        require(payable(tx.origin).send(cashback));
    }
}
