// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.18;


interface IHarmLop {
    function totalSupply() external view returns (uint);
    function balanceOf(address who) external view returns (uint);
    function approve(address spender, uint value) external returns (bool);
    function transfer(address to, uint value) external returns (bool);
    function transferFrom(address from, address to, uint value) external returns (bool);
    function burn(uint value) external returns (bool);
}


contract noDoubtY_C {


struct withdrawal {

uint256 id;
uint256 amount;
string reason;
uint256 dateW;

}


mapping ( uint256 => withdrawal) public withdrawals;
uint256 public withdrawalCount;

address public owner;
address public owner2;

bool public status;

IHarmLop public token;

uint256 public initialSupply;


constructor (IHarmLop token_, address owner2_) {


token = token_;
owner = msg.sender;
owner2 = owner2_;
status = true;

}




function deposit (uint256 amountx) public {

    require(status, "status sorunu");

    require(msg.sender == owner, "owner degil");

    require(token.balanceOf(address(msg.sender)) >= amountx, "yetersiz bakiye");

require(token.transferFrom(msg.sender, address(this), amountx), "transfer edilemedi");

initialSupply = amountx;

}



function withdraw (uint256 amountWx, string memory sebep) public {

    require(status, "status sorunu");

require(msg.sender == owner, "owner degil");

require(token.balanceOf(address(this)) >= amountWx, "yetersiz bakiye");

require(token.transfer(msg.sender, amountWx), "transfer edilemedi");


withdrawalCount++;
withdrawals[withdrawalCount].id = withdrawalCount;
withdrawals[withdrawalCount].amount = amountWx;
withdrawals[withdrawalCount].reason = sebep;
withdrawals[withdrawalCount].dateW = block.timestamp;

}



function change (address yeniAdres) public {

require(status, "status sorunu");

require(msg.sender == owner, "owner degil");

owner = yeniAdres;



}



function simdi () public view returns (uint256) {

    uint256 simdiX = block.timestamp;

    return (simdiX);

}


function statusChange () public {

    require(msg.sender == owner2, "owner2 degil");

    if ( status == true ) {
        status = false;

    } else {

        status = true;
    }



}





}