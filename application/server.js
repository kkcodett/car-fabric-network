
var express = require("express")

var app = express()

var path = require("path")

const FabricCAServices = require("fabric-ca-client");
const { Gateway, Wallets } = require("fabric-network");
const fs = require("fs");

const PORT = 3000
const HOST = "0.0.0.0"

app.use(express.static(path.join(__dirname, "views")))
app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.get('/', (req,res)=>{
    res.sendFile(__dirname + "/views/intro.html")
})

app.get('/info', async(req,res)=>{
    console.log("/info read 요청")
        const cid = req.query.cid
        console.log(cid)

    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, "ccp", "connection-org1.json");
        const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), "wallet");
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get(cid);
        if (!identity) {
            console.log(
                'An identity for the user "appUser" does not exist in the wallet'
            );
            console.log("Run the registerUser.js application before retrying");
            return;
        }
        const identity2 = await wallet.get(cid);
        if (!identity2) {
            console.log(
                'An identity for the user "appUser2" does not exist in the wallet'
            );
            console.log("Run the registerUser.js application before retrying");
            return;
        }
        const identity3 = await wallet.get(cid);
        if (!identity3) {
            console.log(
                'An identity for the user "appUser3" does not exist in the wallet'
            );
            console.log("Run the registerUser.js application before retrying");
            return;
        }
        const identity4 = await wallet.get(cid);
        if (!identity4) {
            console.log(
                'An identity for the user "appUser4" does not exist in the wallet'
            );
            console.log("Run the registerUser.js application before retrying");
            return;
        }
        const identity5 = await wallet.get(cid);
        if (!identity5) {
            console.log(
                'An identity for the user "appUser5" does not exist in the wallet'
            );
            console.log("Run the registerUser.js application before retrying");
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: cid,
            identity2: cid,
            identity3: cid,
            identity4: cid,
            identity5: cid,
            discovery: { enabled: true, asLocalhost: true },
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork("mychannelall");

        // Get the contract from the network.
        const contract = network.getContract("basic");

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        var result = await contract.evaluateTransaction("InfoCar", cid);
        console.log(
            `Transaction has been evaluated, result is: ${result.toString()}`
        );

        // Disconnect from the gateway.
        await gateway.disconnect();

       const res_str = `{"result":"success", "msg":${result}}`
       res.status(200).json(JSON.parse(res_str))
        
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}
)

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)