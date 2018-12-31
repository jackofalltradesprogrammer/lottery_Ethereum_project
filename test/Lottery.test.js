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

    it('allows one account to enter', async () => {     // because it has async code inside in it, it needs to wait
        await lottery.methods.enter().send({    
            from: accounts[0],   // who is attempting to enter
            value: web3.utils.toWei('0.02', 'ether')             // some money we want to send along
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        
        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length);
    });

    it('multiple account to enter', async () => {     // because it has async code inside in it, it needs to wait
        await lottery.methods.enter().send({    
            from: accounts[0],   // who is attempting to enter
            value: web3.utils.toWei('0.02', 'ether')             // some money we want to send along
        });

        await lottery.methods.enter().send({    
            from: accounts[1],   // who is attempting to enter
            value: web3.utils.toWei('0.02', 'ether')             // some money we want to send along
        });

        await lottery.methods.enter().send({    
            from: accounts[2],   // who is attempting to enter
            value: web3.utils.toWei('0.02', 'ether')             // some money we want to send along
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        
        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        assert.equal(3, players.length);
    });

    // WE want this function to fail, so we use try and catch block to throw an error
    it('requires a minimum amout of ether to enter', async () => {
        try{
            await lottery.methods.enter().send({
                from: accounts[0],
                value: 0
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('only manager can call pickWinner', async () => {
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('sends money to the winner and resets the players array', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });

        const initialBalance = await web3.eth.getBalance(accounts[0]); // get the account balance of the ether
        await lottery.methods.pickWinner().send({from: accounts[0] });
        const finalBalance = await web3.eth.getBalance(accounts[0]);
        const difference = finalBalance - initialBalance;
        assert(difference > web3.utils.toWei('1.8', 'ether'));
    });
});