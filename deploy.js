const HDWalletProvider = require('truffle-hdwallet-provider'); // what account and network we are going to use
const Web3 = require('web3');
const { interface, bytecode } = require('./compile'); // one . is used as we are in the same directory

const provider = new HDWalletProvider(
    'damp frost betray fork tray original drastic loan visit earth celery cart',  // to generate account
    'https://rinkeby.infura.io/v3/a9ee51eb0dd04456942f5bde2edb91b1'               // to connect to rinkeby network
);

const web3 = new Web3(provider); // instance to connect to Rinkeby network

const deploy = async () => {
    const accounts = await web3.eth.getAccounts(); // get accounts from our web3 instance

    console.log('Attempting to deploy from account', accounts[0]);

    // the contract ("It tells what or what will exist in the block chain")
    const result = await new web3.eth.Contract(JSON.parse(interface))             // instance with ABI object (not JSON) from constructor Contract() either interacts or to create new 
        .deploy({ data: bytecode })    // it tells we need to deploy a contract (transaction object) with arguments
        .send({ gas: '1000000', from: accounts[0] });             // instructs web3 to send out a transaction that creates this contract

    console.log('Contract deployed to', result.options.address);
};
deploy();  // this function is only used so we can use Async/Await features