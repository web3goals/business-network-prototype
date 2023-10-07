// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Partner.sol";

contract PartnerFactory {
    struct PartnerParams {
        address account;
        address partner;
    }

    PartnerParams[] public partners;

    event PartnerCreated(address account, address partner);

    /**
     * Function to create partner contract and send ethers to it
     */
    function becomePartner(string memory _details) external payable {
        Partner partner = (new Partner){value: msg.value}(_details);
        partner.transferOwnership(msg.sender);
        partners.push(PartnerParams(msg.sender, address(partner)));
        emit PartnerCreated(msg.sender, address(partner));
    }

    function getPartners() external view returns (PartnerParams[] memory) {
        return partners;
    }

    function getPartner(
        address account
    ) external view returns (PartnerParams memory) {
        for (uint i = 0; i < partners.length; i++) {
            if (partners[i].account == account) {
                return partners[i];
            }
        }
        return PartnerParams(address(0), address(0));
    }
}
