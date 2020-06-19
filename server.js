const express = require('express')
const Web3 = require("web3");
const url = "http://localhost:8545";
const web3 = new Web3(new Web3.providers.HttpProvider(url));

LocationVerifier = require("./zklocation/build/contracts/Verifier.json")
var locationverifier = null, accounts = null

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
var x = parseFloat(req.param("x"))
var y = parseFloat(req.param("y")) 
var xr = parseFloat(req.param("xr")) 
var yr = parseFloat(req.param("yr")) 
    var proof = await zkmain.generate_location_proof(x, y, xr, yr)
    console.log(x)
    console.log(y)
    console.log(xr)
    console.log(yr)

    res.send(proof) 
})

app.get('/loc/verify', async (req, res) => {
    await getContracts()
    // console.log('the verifying bit')
    var proofString = req.param("location_proof")
    var location_proof = JSON.parse(decodeURI(proofString))
    accounts = await web3.eth.getAccounts()
    // console.log(accounts)
    try {
        // console.log(location_proof)
        console.log([parseInt(location_proof["inputs"][0])])
        
        result =  await locationverifier.methods.verifyTx(location_proof["proof"]["a"], location_proof["proof"]["b"], location_proof["proof"]["c"], [1])
        .call({from: accounts[0], gas: 600000})

        console.log("result is " + result)
        res.json(result)
        result = null
    }
    catch(error) {
        console.log(error)
    }
    
})

async function getContracts() {
    let chainId = await web3.eth.net.getId()
    console.log(chainId)
    locationverifier = new web3.eth.Contract(LocationVerifier.abi, LocationVerifier["networks"][chainId]["address"])
}

app.listen(3000, () =>{
    console.log(`Server started.`)
})

