const assert = require('assert'); // use for assertions
const ganache = require('ganache-cli');
const Web3 = require('web3'); // Web3 is camel case because it is a constructor

// Update the two lines to fix a web3 error
const provider = ganache.provider();
const web3 = new Web3(provider)// working with an instance
const {interface, bytecode } = require('../compile'); // receives the only two properties from the exported smart contract object by solidity

let lottery;
let accounts;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode})
        .send({ from: accounts[0], gas: '1000000' });
});

describe('Lottery Contract', () => {
    it('deploys a contract', () => {
        assert.ok(lottery.options.address);
    });
});