pragma solidity ^0.5.0;

contract Tgthr {
    string public name = "Tgthr";

    // Store Images
    struct Image {
        uint256 id;
        string hash;
        string description;
        uint256 tipAmount;
        address payable author;
    }

    mapping(uint256 => Image) public images;

    // Create Images
    function uploadImage() public {
        images[1] = Image(1, "abc123", "Hello World!", 0, address(0x0));
    }

    // Tip Images
}
