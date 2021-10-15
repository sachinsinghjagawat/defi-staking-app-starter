// pragma solidity >=0.7.0 <0.9.0;
pragma solidity ^0.5.7;

import "./RWD.sol";
import "./Tether.sol";

contract DecentralBank {
  string public name = "DecentralBank";
  address public owner;
  Tether public tether;
  RWD public rwd;

  address [] public stakers;

  mapping (address => uint) public stakingBalance;
  mapping (address => bool) public hasStacked;
  mapping (address => bool) public isStaking;

  constructor (RWD _rwd, Tether _tether) public {
      rwd = _rwd;
      tether = _tether;
      owner = msg.sender;
  }

  function depositTokens (uint _amount) public {
    require (_amount >0, "amount must be greater than 0");

    tether.transferFrom(msg.sender, address(this), _amount);

    stakingBalance[msg.sender] += _amount;
    if (!hasStacked[msg.sender]) {
      stakers.push(msg.sender);
    }
    hasStacked[msg.sender] =true;
    isStaking[msg.sender] = true;
  }

  function unstakeTokens () public {
    uint balance= stakingBalance [msg.sender];
    require (balance >0, "Balance should be greater than Zero" );

    tether.transfer (msg.sender, balance);
    stakingBalance[msg.sender]=0;
    isStaking[msg.sender] = false;
  }

  function issueTokens () public {
    require (msg.sender == owner, "sender must be owner");

    for (uint i=0; i<stakers.length; i++) {
      uint balance = stakingBalance[stakers[i]]/9;
      if (balance>0){
        rwd.transfer(stakers[i], balance);
      }
    }
  }
}
