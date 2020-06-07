const express = require('express')
const Web3 = require("web3");
const url = "http://localhost:8545";
const web3 = new Web3(new Web3.providers.HttpProvider(url));

LocationVerifier = require("./zklocation/build/contracts/Verifier.json")
var locationverifier = null

const zkmain = require("./zkmain.js")

const app = express()

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get('/', async(req, res) => {
    res.send("hey")
})

app.get('/loc/proof', async (req, res) => {
   var x = parseInt(req.param("x")).toFixed(7)
    var y = parseInt(req.param("y")).toFixed(7)
    var xr = parseInt(req.param("xr")).toFixed(7)
    var yr = parseInt(req.param("yr")).toFixed(7)
    var proof = await zkmain.generate_location_proof(x, y, xr, yr)
    console.log(proof)
    res.send(proof)
})

app.get('/loc/verify', async (req, res) => {
    await getContracts()
    var proofString = req.param("proof")
    var proof = JSON.parse(proofString)
    accounts = await web3.eth.getAccounts();
    console.log(proof)
    // var result = await locationverifier.methods.verifyTx(proof["proof"]["a"], age_proof["proof"]["b"],age_proof["proof"]["c"],age_proof["inputs"])
    // .call({from:accounts[0], gas:600000});
    // console.log(result)
})

async function getContracts() {
    // let chainId = await web3.eth.net.getId()
    // locationverifier = new web3.eth.Contract(LocationVerifier.abi, LocationVerifier["networks"]["1591474835780"]["address"])
    console.log(LocationVerifier["networks"]["1591474835780"]["address"])
}

app.listen(3000, () =>{
    console.log(`Server started.`)
})












