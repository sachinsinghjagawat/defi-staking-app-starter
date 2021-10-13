const Tether = artifacts.require('Migrations');

module.exports = async function (deployer){
    await deployer.deploy(Tether);
};