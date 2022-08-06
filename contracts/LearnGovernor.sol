// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "hardhat/console.sol";

interface ERC20Interface {
    function mint(address to, uint256 amount) external;
}

/// @custom:security-contact viral.sangani2011@gmail.com
contract LearnDAOGovernor is
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction
{
    address _daiToken;
    address _governanceToken;

    mapping(string => address) public acceptedProposal;

    constructor(
        ERC20Votes _token,
        string memory _name,
        address _tokenToAccept
    )
        Governor(_name)
        GovernorSettings(
            0, /* 0 block by default for testing */
            90, /* 3 min */
            0
        )
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(4)
    {
        _daiToken = _tokenToAccept;
        _governanceToken = address(_token);
    }

    function addMember(uint256 _amount) public {
        require(
            IERC20(_daiToken).allowance(msg.sender, address(this)) >= _amount,
            "DAI allowance not set"
        );
        IERC20(_daiToken).transferFrom(msg.sender, address(this), _amount);
        ERC20Interface(_governanceToken).mint(address(msg.sender), _amount);
    }

    function setAcceptedProposal(string memory _id, address user) public {
        acceptedProposal[_id] = user;
    }

    function disburseIncentive(
        string memory _id,
        address _user,
        uint256 _amount
    ) public {
        require(acceptedProposal[_id] != address(0), "Proposal not accepted");
        require(
            acceptedProposal[_id] == _user,
            "Only the proposer can disburse"
        );
        ERC20Interface(_governanceToken).mint(address(_user), _amount);
    }

    function receiveEthForTransactions() public payable {
        require(msg.value >= 1 ether, "Minimum 1 ether required");
        console.log("Received ==> ", msg.value);
    }

    function votingDelay()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingDelay();
    }

    function votingPeriod()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingPeriod();
    }

    function quorum(uint256 blockNumber)
        public
        view
        override(IGovernor, GovernorVotesQuorumFraction)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    function getVotes(address account, uint256 blockNumber)
        public
        view
        override(IGovernor, GovernorVotes)
        returns (uint256)
    {
        return super.getVotes(account, blockNumber);
    }

    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }
}
