/* eslint-disable no-undef */
const DecentralBank = artifacts.require('DecentralBank');

module.exports = async function issueRewards (callback) {
    let decentralBank = await DecentralBank.deployed();
    await decentralBank.issueTokens().then(function () {
        console.log("Promise Resolved");
   }).catch(function () {
        console.log("Promise Rejected");
   });

    console.log ("Tokens are successfully issued");
    callback ();
}