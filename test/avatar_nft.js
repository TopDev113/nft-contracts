const AvatarNFT = artifacts.require("AvatarNFT");

const ether = 1e18;

contract("NFT", accounts => {
    // it should deploy successfully
    it("should deploy successfully", async () => {
        const nft = await AvatarNFT.deployed();
        assert.ok(nft.address);
    });

    // it should fail to mint when sale is not started
    it("should fail to mint when sale is not started", async () => {
        const nft = await AvatarNFT.deployed();
        // mint
        try {
            await nft.mint(1, { from: accounts[1], value: 0.03 * ether });
        } catch (error) {
            // check that error message has expected substring 'Sale not started'
            assert.include(error.message, "Sale not started");
        }
    });

    // it should mint successfully
    it("should mint successfully when sale is started", async () => {
        const nft = await AvatarNFT.deployed();
        // flipSaleStarted
        await nft.flipSaleStarted();
        // mint
        const tx = await nft.mint(1, { from: accounts[0], value: 0.03 * ether });
        assert.ok(tx);
    });

    // it should be able to mint 10 tokens in one transaction
    it("should be able to mint 10 tokens in one transaction", async () => {
        const nft = await AvatarNFT.deployed();
        // flipSaleStarted
        // await nft.flipSaleStarted();
        // mint
        const nTokens = 10;
        const tx = await nft.mint(nTokens, { from: accounts[0], value: 0.03 * nTokens * ether });
        assert.ok(tx);
    });

    // it should fail trying to mint more than 20 tokens
    it("should fail trying to mint more than 20 tokens", async () => {
        const nft = await AvatarNFT.deployed();

        // mint
        try {
            await nft.mint(21, { from: accounts[0], value: 0.03 * 21 * ether });
        } catch (error) {
            // check that error message has expected substring 'You cannot mint more than'
            assert.include(error.message, "You cannot mint more than");
        }
    });

    // it should be able to mint when you send more ether than needed
    it("should be able to mint when you send more ether than needed", async () => {
        const nft = await AvatarNFT.deployed();

        // mint
        const tx = await nft.mint(1, { from: accounts[0], value: 0.5 * ether });
        assert.ok(tx);
    });

    // it should be able to change baseURI from owner account, and _baseURI() value would change
    it("should be able to change baseURI from owner account, and _baseURI() value would change", async () => {
        const nft = await AvatarNFT.deployed();

        const baseURI = "https://avatar.com/";
        await nft.setBaseURI(baseURI, { from: accounts[0] });
        // check _baseURI() value
        const _baseURI = await nft.baseURI();
        assert.equal(_baseURI, baseURI);
    });

    // it should be able to mint reserved from owner account
    it("should be able to mint reserved from owner account", async () => {
        const nft = await AvatarNFT.deployed();

        // mint
        const tx = await nft.claimReserved(3, accounts[1], { from: accounts[0] });
        assert.ok(tx);
    });

    // it should not be able to mint reserved from accounts other that owner
    it("should not be able to mint reserved from accounts other that owner", async () => {
        const nft = await AvatarNFT.deployed();

        // mint
        try {
            await nft.claimReserved(3, accounts[1], { from: accounts[1] });
        } catch (error) {
            // check that error message has expected substring Ownable: caller is not the owner
            assert.include(error.message, "Ownable: caller is not the owner");
        }
    });

})