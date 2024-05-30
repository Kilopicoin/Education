// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.19;



interface IHarmLop {
    function totalSupply() external view returns (uint);
    function balanceOf(address who) external view returns (uint);
    function approve(address spender, uint value) external returns (bool);
    function transfer(address to, uint value) external returns (bool);
    function transferFrom(address from, address to, uint value) external returns (bool);
    function burn(uint value) external returns (bool);
}



library SafeMath {

    /**
     * @dev Multiplies two numbers, reverts on overflow.
     */
    function mul(uint a, uint b) internal pure returns (uint) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
        if (a == 0) {
            return 0;
        }

        uint c = a * b;
        require(c / a == b);

        return c;
    }

    /**
     * @dev Integer division of two numbers truncating the quotient, reverts on division by zero.
     */
    function div(uint a, uint b) internal pure returns (uint) {
        require(b > 0); // Solidity only automatically asserts when dividing by 0
        uint c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    /**
     * @dev Subtracts two numbers, reverts on overflow (i.e. if subtrahend is greater than minuend).
     */
    function sub(uint a, uint b) internal pure returns (uint) {
        require(b <= a);
        uint c = a - b;

        return c;
    }

    /**
     * @dev Adds two numbers, reverts on overflow.
     */
    function add(uint a, uint b) internal pure returns (uint) {
        uint c = a + b;
        require(c >= a);

        return c;
    }

    /**
     * @dev Divides two numbers and returns the remainder (unsigned integer modulo),
     * reverts when dividing by zero.
     */
    function mod(uint a, uint b) internal pure returns (uint) {
        require(b != 0);
        return a % b;
    }
}





contract pathfinderY_C is IHarmLop {


IHarmLop public token;


struct Project {

    uint256 id;
    string name;
    uint256 vote;

}

struct ProjectDone {

    uint256 id;
    string name;
    uint256 burnt;
    string link;

}



mapping (uint256 => Project) public Projects;
uint256 public ProjectCount;

mapping (uint256 => ProjectDone) public ProjectsDone;
uint256 public ProjectDoneCount;

address public feeCollector;
address public owner;


event e_addProject(address isleten, string isim, uint256 vote, uint256 zaman);
event e_addtoProject(address isleten, uint256 id, uint256 vote, uint256 zaman);






// isim icin baslangic

	using SafeMath for uint;

    string public constant name = "Pathfinder";
    string public constant symbol = "PATH";
    uint8 public constant decimals = 6;
    uint public totalSupply = 0;
    bool public statusWorld = true;

    mapping(address => uint) public balanceOf;
    mapping(address => mapping(address => uint)) public allowance;

    event Transfer(address indexed from, address indexed to, uint value);
    event Approval(address indexed owner, address indexed spender, uint value);


	// isim icin bitis








    constructor (IHarmLop token_, address feeCollector_) {

        feeCollector = feeCollector_;
        token = token_;
        owner = msg.sender;
        _mint(msg.sender, 1000000);
        statusWorld = false;

    }





    // isim icin baslangic

function approve(address _spender, uint _value) external returns (bool) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function _mint(address _to, uint _amount) internal returns (bool) {
        require(statusWorld, "W P");
        totalSupply += _amount;
        unchecked {
            balanceOf[_to] += _amount;
        }
        emit Transfer(address(0x0), _to, _amount);
        return true;
    }

    function _transfer(address from, address to, uint256 value) internal returns (bool) {
        require(to != address(0));

        balanceOf[from] = balanceOf[from].sub(value);
        balanceOf[to] = balanceOf[to].add(value);
        emit Transfer(from, to, value);
        return true;
    }

    function _burn(address account, uint256 value) internal returns (bool) {
        require(account != address(0));

        totalSupply = totalSupply.sub(value);
        balanceOf[account] = balanceOf[account].sub(value);
        emit Transfer(account, address(0), value);
        return true;
    }

    function burn(uint value) external returns (bool){
        _burn(msg.sender, value);
        return true;
    }

    function transfer(address _to, uint _value) external returns (bool) {
        return _transfer(msg.sender, _to, _value);
    }

    function transferFrom(address _from, address _to, uint _value) external returns (bool) {
        uint allowed_from = allowance[_from][msg.sender];
        if (allowed_from != type(uint).max) {
            allowance[_from][msg.sender] -= _value;
        }
        return _transfer(_from, _to, _value);
    }

    function increaseAllowance(
        address spender,
        uint addedValue
    )
    public
    returns (bool)
    {
        require(spender != address(0));

        allowance[msg.sender][spender] += addedValue;
        emit Approval(msg.sender, spender, allowance[msg.sender][spender]);
        return true;
    }

    function decreaseAllowance(
        address spender,
        uint subtractedValue
    )
    public
    returns (bool)
    {
        require(spender != address(0));

        allowance[msg.sender][spender] -= subtractedValue;
        emit Approval(msg.sender, spender, allowance[msg.sender][spender]);
        return true;
    }

// isim icin bitis













function addProject (string memory isim, uint256 voteAmount ) public {


require(token.balanceOf(address(msg.sender)) >= voteAmount, "bakiye yetersiz");
require(token.transferFrom(msg.sender, address(this), voteAmount), "token alinamadi");


ProjectCount++;

Projects[ProjectCount] = Project(ProjectCount, isim, voteAmount);

emit e_addProject (msg.sender, isim, voteAmount, block.timestamp);

}




function addtoProject (uint256 idX, uint256 voteAdd) public {


require(Projects[idX].vote != 0, "satir bos");

require(token.balanceOf(address(msg.sender)) >= voteAdd, "bakiye yetersiz");
require(token.transferFrom(msg.sender, address(this), voteAdd), "token alinamadi");

Projects[idX].vote = Projects[idX].vote + voteAdd;

emit e_addtoProject (msg.sender, idX, voteAdd, block.timestamp);

}





function publishProject (uint256 idP, string memory linkP) public {

require(msg.sender == owner, "only owner");


require(Projects[idP].vote != 0, "satir bos");

string memory gecenIsim = Projects[idP].name;
uint256 toplamOy = Projects[idP].vote;
uint256 yakilacak = toplamOy / 2;
uint256 atilacakFee = toplamOy - yakilacak;

ProjectDoneCount++;
ProjectsDone[ProjectDoneCount] = ProjectDone(ProjectDoneCount, gecenIsim, yakilacak, linkP);

string memory kayanIsim = Projects[ProjectCount].name;
uint256 kayanVote = Projects[ProjectCount].vote;


Projects[idP] = Project(idP, kayanIsim, kayanVote);

Projects[ProjectCount] = Project(ProjectCount, "", 0);
ProjectCount--;


require(token.burn(yakilacak), "yakamadi");
require(token.transfer(feeCollector, atilacakFee), "fee gonderilemedi");




}





function icerigeMudahele (uint256 idM, string memory yeniIcerik) public {

require(msg.sender == owner, "only owner");

require(Projects[idM].vote != 0, "satir bos");

Projects[idM].name = yeniIcerik;



}







}