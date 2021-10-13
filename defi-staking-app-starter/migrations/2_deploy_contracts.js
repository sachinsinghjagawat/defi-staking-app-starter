/* eslint-disable no-undef */
const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');

module.exports = async function (deployer){
    // Deploy Tether Contract
    await deployer.deploy(Tether);

    // Deploy RWD Contract
    await deployer.deploy(RWD);

    // Deploy DecentralBank Contract
    await deployer.deploy(DecentralBank);
};