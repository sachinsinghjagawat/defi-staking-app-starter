const assert = require("assert");

/* eslint-disable no-undef */
const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');

require ("chai")
.use(require("chai-as-promised"))
.should();

contract ("DecentralBank", ([owner, customer]) => {
    let tether, rwd, decentralBank;

    function tokens(number) {
        return web3.utils.toWei(number, 'ether')
    }

    before (async () => {
        tether = await Tether.new();
        rwd = await RWD.new();
        decentralBank = await DecentralBank.new(rwd.address, tether.address);

        await rwd.transfer (decentralBank.address, web3.utils.toWei('1000000'));

        await tether.transfer (customer, web3.utils.toWei('100', 'ether'), {from: owner});

    })

    describe ("Tether Development", async () => {
        it ("Checking name:", async () => {
            const name = await tether.name();
            assert.equal(name, "Tether", "Kuch to gadbad hai");
        })
    });

    describe ("RWD Deployment",  async () => {
        it ("Checking name:", async () => {
            const name = await rwd.name();
            assert.equal(name, "Reward Token", "Kuch to gadbad hai");
        })
    });

    describe ("DecentralBank Deployment",  async () => {
        it ("Checking name:", async () => {
            const name = await decentralBank.name();
            assert.equal(name, "DecentralBank", "Kuch to gadbad hai");
        })

        it ("Checking RWD Token Amount:", async () => {
            const balance = await rwd.balanceOf(decentralBank.address);
            assert.equal(balance, web3.utils.toWei('1000000', 'ether'), "Kuch to gadbad hai");
        })
        describe ("Yeild farming", async () =>{
            it ("reward tokens for staking", async () => {
                let result = await tether.balanceOf(customer);
                assert.equal (result, web3.utils.toWei('100', 'ether'), "Kuch to gadbad hai");
            })

            it ("checking the transfer of token", async () => {
                await tether.approve (decentralBank.address, web3.utils.toWei('75'), {from: customer});
                await decentralBank.depositTokens (web3.utils.toWei('75'), {from: customer});

                let result = await tether.balanceOf(customer);
                assert.equal(result, web3.utils.toWei('25'), "Kuch to gadbad hai");

                let bankBalance = await tether.balanceOf(decentralBank.address);
                assert.equal(bankBalance, web3.utils.toWei('75', "ether"), "Kuch to gadbad hai");

                
            })
            it ("checking staking", async () => {
                let staked = await decentralBank.isStaking(customer);
                assert.equal(staked.toString(), 'true', "Kuch to gadbad hai");
            })
            it ("checking token issuing", async () => {
                await decentralBank.issueTokens ({from: owner});
                await decentralBank.issueTokens ({from: customer}).should.be.rejected;

                await decentralBank.unstakeTokens ({from: customer});
                let balance = await tether.balanceOf (customer);
                assert.equal(balance, web3.utils.toWei('100', "ether"), "Kuch to gadbad hai"+ (balance.toString()));

                let staked = await decentralBank.isStaking(customer);
                assert.equal(staked.toString(), 'false', "Kuch to gadbad hai");

            })
        })
    });
})