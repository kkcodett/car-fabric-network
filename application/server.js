
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

app.get('/infocar', async(req,res)=>{
    console.log("/infocar read 요청")
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
        const identity = await wallet.get("appUser");
        if (!identity) {
            console.log(
                'An identity for the user "appUser" does not exist in the wallet'
            );
            console.log("Run the registerUser.js application before retrying");
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: "appUser",
            discovery: { enabled: true, asLocalhost: true },
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork("mychannelall");

        // Get the contract from the network.
        const contract = network.getContract("cfnall");

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

app.post('/addcar', async(req,res)=>{
    console.log("/addcar read 요청")
        const cid = req.body.cid
        const value = req.body.value
        console.log(cid, value)

        try {
            // load the network configuration
            const ccpPath = path.resolve(__dirname, "ccp", "connection-org1.json");
            let ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
    
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), "wallet");
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const identity = await wallet.get("appUser");
            if (!identity) {
                console.log(
                    'An identity for the user "appUser" does not exist in the wallet'
                );
                console.log("Run the registerUser.js application before retrying");
                return;
            }
    
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, {
                wallet,
                identity: "appUser",
                discovery: { enabled: true, asLocalhost: true },
            });
    
            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork("mychannelall");
    
            // Get the contract from the network.
            const contract = network.getContract("cfnall");
    
            // Submit the specified transaction.
            // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
            // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
            await contract.submitTransaction(
                "AddCar",
                cid,
                value
            );
            console.log("Transaction has been submitted");
    
            // Disconnect from the gateway.
            await gateway.disconnect();
    
            const resultPath = path.join(process.cwd(), "views/result.html")
            var resultHTML = fs.readFileSync(resultPath, "utf-8")
            resultHTML = resultHTML.replace("<dir></dir>", "<dir><p>Transaction has been successed !</p></dir>")
            res.status(200).send(resultHTML)
    
            //const res_str = `{"result":"success", "msg":<dir><p>Transaction(TransferAsset) has been successed !</p></dir>}`
            //res.status(200).json(JSON.parse(res_str)
            
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
}
)

app.post('/newowner', async(req,res)=>{
    console.log("/newowner read 요청")
        const cid = req.body.cid
        const id = req.body.id
        const crday = req.body.crday
        console.log(cid, id, crday)

        try {
            // load the network configuration
            const ccpPath = path.resolve(__dirname, "ccp", "connection-org1.json");
            let ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
    
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), "wallet");
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const identity = await wallet.get("appUser");
            if (!identity) {
                console.log(
                    'An identity for the user "appUser" does not exist in the wallet'
                );
                console.log("Run the registerUser.js application before retrying");
                return;
            }
    
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, {
                wallet,
                identity: "appUser",
                discovery: { enabled: true, asLocalhost: true },
            });
    
            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork("mychannelall");
    
            // Get the contract from the network.
            const contract = network.getContract("cfnall");
    
            // Submit the specified transaction.
            // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
            // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
            await contract.submitTransaction(
                "NewOwner",
                cid,
                id,
                crday
            );
            console.log("Transaction has been submitted");
    
            // Disconnect from the gateway.
            await gateway.disconnect();
    
            const resultPath = path.join(process.cwd(), "views/result.html")
            var resultHTML = fs.readFileSync(resultPath, "utf-8")
            resultHTML = resultHTML.replace("<dir></dir>", "<dir><p>Transaction has been successed !</p></dir>")
            res.status(200).send(resultHTML)
    
            //const res_str = `{"result":"success", "msg":<dir><p>Transaction(TransferAsset) has been successed !</p></dir>}`
            //res.status(200).json(JSON.parse(res_str)
            
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
}
)

app.get('/ownerread', async(req,res)=>{
    console.log("/ownerread read 요청")
        const id = req.query.id
        console.log(id)

    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, "ccp", "connection-org1.json");
        const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), "wallet");
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get("appUser");
        if (!identity) {
            console.log(
                'An identity for the user "appUser" does not exist in the wallet'
            );
            console.log("Run the registerUser.js application before retrying");
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: "appUser",
            discovery: { enabled: true, asLocalhost: true },
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork("mychannelall");

        // Get the contract from the network.
        const contract = network.getContract("cfnall");

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        var result = await contract.evaluateTransaction("OwnerRead", id);
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

app.post('/repairregister', async(req,res)=>{
    console.log("/repairregister read 요청")
        const rid = req.body.rid
        const cid = req.body.cid
        const part = req.body.part
        const price = req.body.price
        const message = req.body.message
        console.log(rid, cid, part, price, message)

        try {
            // load the network configuration
            const ccpPath = path.resolve(__dirname, "ccp", "connection-org1.json");
            let ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
    
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), "wallet");
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const identity = await wallet.get("appUser");
            if (!identity) {
                console.log(
                    'An identity for the user "appUser" does not exist in the wallet'
                );
                console.log("Run the registerUser.js application before retrying");
                return;
            }
    
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, {
                wallet,
                identity: "appUser",
                discovery: { enabled: true, asLocalhost: true },
            });
    
            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork("mychannelall");
    
            // Get the contract from the network.
            const contract = network.getContract("cfnall");
    
            // Submit the specified transaction.
            // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
            // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
            await contract.submitTransaction(
                "RepairRegister",
                rid,
                cid,
                part,
                price,
                message
            );
            console.log("Transaction has been submitted");
    
            // Disconnect from the gateway.
            await gateway.disconnect();
    
            const resultPath = path.join(process.cwd(), "views/result.html")
            var resultHTML = fs.readFileSync(resultPath, "utf-8")
            resultHTML = resultHTML.replace("<dir></dir>", "<dir><p>Transaction has been successed !</p></dir>")
            res.status(200).send(resultHTML)
    
            //const res_str = `{"result":"success", "msg":<dir><p>Transaction(TransferAsset) has been successed !</p></dir>}`
            //res.status(200).json(JSON.parse(res_str)
            
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
}
)

app.get('/getcar', async(req,res)=>{
    console.log("/getcar read 요청")
        const rid = req.query.rid
        console.log(rid)

    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, "ccp", "connection-org1.json");
        const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), "wallet");
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get("appUser");
        if (!identity) {
            console.log(
                'An identity for the user "appUser" does not exist in the wallet'
            );
            console.log("Run the registerUser.js application before retrying");
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: "appUser",
            discovery: { enabled: true, asLocalhost: true },
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork("mychannelall");

        // Get the contract from the network.
        const contract = network.getContract("cfnall");

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        var result = await contract.evaluateTransaction("GetCar", rid);
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

app.post('/reactcar', async(req,res)=>{
    console.log("/reactcar read 요청")
        const rid = req.body.rid
        const price = req.body.price
        console.log(rid, price)

        try {
            // load the network configuration
            const ccpPath = path.resolve(__dirname, "ccp", "connection-org1.json");
            let ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
    
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), "wallet");
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const identity = await wallet.get("appUser");
            if (!identity) {
                console.log(
                    'An identity for the user "appUser" does not exist in the wallet'
                );
                console.log("Run the registerUser.js application before retrying");
                return;
            }
    
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, {
                wallet,
                identity: "appUser",
                discovery: { enabled: true, asLocalhost: true },
            });
    
            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork("mychannelall");
    
            // Get the contract from the network.
            const contract = network.getContract("cfnall");
    
            // Submit the specified transaction.
            // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
            // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
            await contract.submitTransaction(
                "ReactCar",
                rid,
                price
            );
            console.log("Transaction has been submitted");
    
            // Disconnect from the gateway.
            await gateway.disconnect();
    
            const resultPath = path.join(process.cwd(), "views/result.html")
            var resultHTML = fs.readFileSync(resultPath, "utf-8")
            resultHTML = resultHTML.replace("<dir></dir>", "<dir><p>Transaction has been successed !</p></dir>")
            res.status(200).send(resultHTML)
    
            //const res_str = `{"result":"success", "msg":<dir><p>Transaction(TransferAsset) has been successed !</p></dir>}`
            //res.status(200).json(JSON.parse(res_str)
            
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
}
)

app.get('/pricecar', async(req,res)=>{
    console.log("/pricecar read 요청")
        const rid = req.query.rid
        console.log(rid)

    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, "ccp", "connection-org1.json");
        const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), "wallet");
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get("appUser");
        if (!identity) {
            console.log(
                'An identity for the user "appUser" does not exist in the wallet'
            );
            console.log("Run the registerUser.js application before retrying");
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: "appUser",
            discovery: { enabled: true, asLocalhost: true },
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork("mychannelall");

        // Get the contract from the network.
        const contract = network.getContract("cfnall");

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        var result = await contract.evaluateTransaction("PriceCar", rid);
        console.log(
            `Transaction has been evaluated, result is: ${result.toString()}`
        );

        // Disconnect from the gateway.
        await gateway.disconnect();

       //const res_str = `{"result":"success", "msg":${result}}`
       //res.status(200).json(JSON.parse(res_str))
        const resultPath = path.join(process.cwd(), "views/result.html")
        var resultHTML = fs.readFileSync(resultPath, "utf-8")
        resultHTML = resultHTML.replace("<dir></dir>", "<dir><p>Transaction has been successed !</p></dir>")
        res.status(200).send(resultHTML)
        
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}
)

app.post('/ownerregister', async(req,res)=>{
    console.log("/ownerregister read 요청")
        const owner = req.body.owner
        const address = req.body.address
        const id = req.body.id
        const rday = req.body.rday
        console.log(owner, address, id, rday)

        try {
            // load the network configuration
            const ccpPath = path.resolve(__dirname, "ccp", "connection-org1.json");
            let ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
    
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), "wallet");
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const identity = await wallet.get("appUser");
            if (!identity) {
                console.log(
                    'An identity for the user "appUser" does not exist in the wallet'
                );
                console.log("Run the registerUser.js application before retrying");
                return;
            }
    
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, {
                wallet,
                identity: "appUser",
                discovery: { enabled: true, asLocalhost: true },
            });
    
            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork("mychannelall");
    
            // Get the contract from the network.
            const contract = network.getContract("cfnall");
    
            // Submit the specified transaction.
            // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
            // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
            await contract.submitTransaction(
                "OwnerRegister",
                owner,
                address,
                id,
                rday
            );
            console.log("Transaction has been submitted");
    
            // Disconnect from the gateway.
            await gateway.disconnect();
    
            const resultPath = path.join(process.cwd(), "views/result.html")
            var resultHTML = fs.readFileSync(resultPath, "utf-8")
            resultHTML = resultHTML.replace("<dir></dir>", "<dir><p>Transaction has been successed !</p></dir>")
            res.status(200).send(resultHTML)
    
            //const res_str = `{"result":"success", "msg":<dir><p>Transaction(TransferAsset) has been successed !</p></dir>}`
            //res.status(200).json(JSON.parse(res_str)
            
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
}
)

app.post('/numbercar', async(req,res)=>{
    console.log("/numbercar read 요청")
        const cid = req.body.cid
        const board = req.body.board
        console.log(cid, board)

        try {
            // load the network configuration
            const ccpPath = path.resolve(__dirname, "ccp", "connection-org1.json");
            let ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
    
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), "wallet");
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const identity = await wallet.get("appUser");
            if (!identity) {
                console.log(
                    'An identity for the user "appUser" does not exist in the wallet'
                );
                console.log("Run the registerUser.js application before retrying");
                return;
            }
    
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, {
                wallet,
                identity: "appUser",
                discovery: { enabled: true, asLocalhost: true },
            });
    
            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork("mychannelall");
    
            // Get the contract from the network.
            const contract = network.getContract("cfnall");
    
            // Submit the specified transaction.
            // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
            // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
            await contract.submitTransaction(
                "NumberCar",
                cid,
                board
            );
            console.log("Transaction has been submitted");
    
            // Disconnect from the gateway.
            await gateway.disconnect();
    
            const resultPath = path.join(process.cwd(), "views/result.html")
            var resultHTML = fs.readFileSync(resultPath, "utf-8")
            resultHTML = resultHTML.replace("<dir></dir>", "<dir><p>Transaction has been successed !</p></dir>")
            res.status(200).send(resultHTML)

            const res_str = `{"result":"success", "msg":<dir><p>Transaction(NumberCar) has been successed !</p></dir>}`
            res.status(200).json(JSON.parse(res_str))
            
            }
            catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
}
)

app.post('/registercar', async(req,res)=>{
    console.log("/registercar read 요청")
        const cid = req.body.cid
        const company = req.body.company
        const model = req.body.model
        const cday = req.body.cday
        const fvalue = req.body.fvalue
        console.log(cid, company, model, cday, fvalue)

        try {
            // load the network configuration
            const ccpPath = path.resolve(__dirname, "ccp", "connection-org1.json");
            let ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
    
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), "wallet");
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const identity = await wallet.get("appUser");
            if (!identity) {
                console.log(
                    'An identity for the user "appUser" does not exist in the wallet'
                );
                console.log("Run the registerUser.js application before retrying");
                return;
            }
    
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, {
                wallet,
                identity: "appUser",
                discovery: { enabled: true, asLocalhost: true },
            });
    
            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork("mychannelall");
    
            // Get the contract from the network.
            const contract = network.getContract("cfnall");
    
            // Submit the specified transaction.
            // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
            // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
            await contract.submitTransaction(
                "RegisterCar",
                cid,
                company,
                model,
                cday,
                fvalue
            );
            console.log("Transaction has been submitted");
    
            // Disconnect from the gateway.
            await gateway.disconnect();
    
            const resultPath = path.join(process.cwd(), "views/result.html")
            var resultHTML = fs.readFileSync(resultPath, "utf-8")
            resultHTML = resultHTML.replace("<dir></dir>", "<dir><p>Transaction has been successed !</p></dir>")
            res.status(200).send(resultHTML)

            //const res_str = `{"result":"success", "msg":<dir><p>Transaction(NumberCar) has been successed !</p></dir>}`
            //res.status(200).json(JSON.parse(res_str))
            
            }
            catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
}
)

app.post('/reportcar', async(req,res)=>{
    console.log("/reportcar read 요청")
        const aid = req.body.aid
        const apart = req.body.apart
        const dod = req.body.dod
        const aday = req.body.aday
        console.log(aid, apart, dod, aday)

        try {
            // load the network configuration
            const ccpPath = path.resolve(__dirname, "ccp", "connection-org1.json");
            let ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
    
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), "wallet");
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const identity = await wallet.get("appUser");
            if (!identity) {
                console.log(
                    'An identity for the user "appUser" does not exist in the wallet'
                );
                console.log("Run the registerUser.js application before retrying");
                return;
            }
    
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, {
                wallet,
                identity: "appUser",
                discovery: { enabled: true, asLocalhost: true },
            });
    
            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork("mychannelall");
    
            // Get the contract from the network.
            const contract = network.getContract("cfnall");
    
            // Submit the specified transaction.
            // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
            // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
            await contract.submitTransaction(
                "ReportCar",
                aid,
                apart,
                dod,
                aday
            );
            console.log("Transaction has been submitted");
    
            // Disconnect from the gateway.
            await gateway.disconnect();
    
            const resultPath = path.join(process.cwd(), "views/result.html")
            var resultHTML = fs.readFileSync(resultPath, "utf-8")
            resultHTML = resultHTML.replace("<dir></dir>", "<dir><p>Transaction has been successed !</p></dir>")
            res.status(200).send(resultHTML)
    
            //const res_str = `{"result":"success", "msg":<dir><p>Transaction(TransferAsset) has been successed !</p></dir>}`
            //res.status(200).json(JSON.parse(res_str)
            
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
}
)

app.get('/regetcar', async(req,res)=>{
    console.log("/regetcar read 요청")
        const aid = req.query.aid
        console.log(aid)

    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, "ccp", "connection-org1.json");
        const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), "wallet");
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get("appUser");
        if (!identity) {
            console.log(
                'An identity for the user "appUser" does not exist in the wallet'
            );
            console.log("Run the registerUser.js application before retrying");
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: "appUser",
            discovery: { enabled: true, asLocalhost: true },
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork("mychannelall");

        // Get the contract from the network.
        const contract = network.getContract("cfnall");

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        var result = await contract.evaluateTransaction("ReGetCar", aid);
        console.log(
            `Transaction has been evaluated, result is: ${result.toString()}`
        );

        // Disconnect from the gateway.
        await gateway.disconnect();

        const res_str = `{"result":"success", "msg":${result}}`
        res.status(200).json(JSON.parse(res_str))
        //const resultPath = path.join(process.cwd(), "views/result.html")
        //var resultHTML = fs.readFileSync(resultPath, "utf-8")
        //resultHTML = resultHTML.replace("<dir></dir>", "<dir><p>Transaction has been successed !</p></dir>")
        //res.status(200).send(resultHTML)
        
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}
)

app.post('/insuranceregister', async(req,res)=>{
    console.log("/insuranceregister read 요청")
        const iid = req.body.iid
        const aid = req.body.aid
        const iday = req.body.iday
        console.log(iid, aid, iday)

        try {
            // load the network configuration
            const ccpPath = path.resolve(__dirname, "ccp", "connection-org1.json");
            let ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
    
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), "wallet");
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const identity = await wallet.get("appUser");
            if (!identity) {
                console.log(
                    'An identity for the user "appUser" does not exist in the wallet'
                );
                console.log("Run the registerUser.js application before retrying");
                return;
            }
    
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, {
                wallet,
                identity: "appUser",
                discovery: { enabled: true, asLocalhost: true },
            });
    
            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork("mychannelall");
    
            // Get the contract from the network.
            const contract = network.getContract("cfnall");
    
            // Submit the specified transaction.
            // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
            // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
            await contract.submitTransaction(
                "InsuranceRegister",
                iid,
                aid,
                iday
            );
            console.log("Transaction has been submitted");
    
            // Disconnect from the gateway.
            await gateway.disconnect();
    
            const resultPath = path.join(process.cwd(), "views/result.html")
            var resultHTML = fs.readFileSync(resultPath, "utf-8")
            resultHTML = resultHTML.replace("<dir></dir>", "<dir><p>Transaction has been successed !</p></dir>")
            res.status(200).send(resultHTML)
    
            //const res_str = `{"result":"success", "msg":<dir><p>Transaction(TransferAsset) has been successed !</p></dir>}`
            //res.status(200).json(JSON.parse(res_str)
            
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
}
)

app.post('/insurancecar', async(req,res)=>{
    console.log("/insurancecar read 요청")
        const iid = req.body.iid
        const iprice = req.body.iprice
        console.log(iid, iprice)

        try {
            // load the network configuration
            const ccpPath = path.resolve(__dirname, "ccp", "connection-org1.json");
            let ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
    
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), "wallet");
            const wallet = await Wallets.newFileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
    
            // Check to see if we've already enrolled the user.
            const identity = await wallet.get("appUser");
            if (!identity) {
                console.log(
                    'An identity for the user "appUser" does not exist in the wallet'
                );
                console.log("Run the registerUser.js application before retrying");
                return;
            }
    
            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, {
                wallet,
                identity: "appUser",
                discovery: { enabled: true, asLocalhost: true },
            });
    
            // Get the network (channel) our contract is deployed to.
            const network = await gateway.getNetwork("mychannelall");
    
            // Get the contract from the network.
            const contract = network.getContract("cfnall");
    
            // Submit the specified transaction.
            // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
            // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
            await contract.submitTransaction(
                "InsuranceCar",
                iid,
                iprice
            );
            console.log("Transaction has been submitted");
    
            // Disconnect from the gateway.
            await gateway.disconnect();
    
            //const resultPath = path.join(process.cwd(), "views/result.html")
            //var resultHTML = fs.readFileSync(resultPath, "utf-8")
            //resultHTML = resultHTML.replace("<dir></dir>", "<dir><p>Transaction has been successed !</p></dir>")
            //res.status(200).send(resultHTML)
    
            const res_str = `{"result":"success", "msg":<dir><p>Transaction(TransferAsset) has been successed !</p></dir>}`
            res.status(200).json(JSON.parse(res_str))
            
        } catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
}
)

app.get('/okcar', async(req,res)=>{
    console.log("/okcar read 요청")
        const iid = req.query.iid
        console.log(iid)

    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, "ccp", "connection-org1.json");
        const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), "wallet");
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get("appUser");
        if (!identity) {
            console.log(
                'An identity for the user "appUser" does not exist in the wallet'
            );
            console.log("Run the registerUser.js application before retrying");
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: "appUser",
            discovery: { enabled: true, asLocalhost: true },
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork("mychannelall");

        // Get the contract from the network.
        const contract = network.getContract("cfnall");

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        var result = await contract.evaluateTransaction("OKCar", iid);
        console.log(
            `Transaction has been evaluated, result is: ${result.toString()}`
        );

        // Disconnect from the gateway.
        await gateway.disconnect();

        const res_str = `{"result":"success", "msg":${result}}`
        res.status(200).json(JSON.parse(res_str))
        //const resultPath = path.join(process.cwd(), "views/result.html")
        //var resultHTML = fs.readFileSync(resultPath, "utf-8")
        //resultHTML = resultHTML.replace("<dir></dir>", "<dir><p>Transaction has been successed !</p></dir>")
        //res.status(200).send(resultHTML)
        
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}
)

app.get('/removecar', async(req,res)=>{
    console.log("/removecar read 요청")
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
        const identity = await wallet.get("appUser");
        if (!identity) {
            console.log(
                'An identity for the user "appUser" does not exist in the wallet'
            );
            console.log("Run the registerUser.js application before retrying");
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: "appUser",
            discovery: { enabled: true, asLocalhost: true },
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork("mychannelall");

        // Get the contract from the network.
        const contract = network.getContract("cfnall");

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        var result = await contract.evaluateTransaction("RemoveCar", cid);
        console.log(
            `Transaction has been evaluated, result is: ${result.toString()}`
        );

        // Disconnect from the gateway.
        await gateway.disconnect();

        //const res_str = `{"result":"success", "msg":${result}}`
        //res.status(200).json(JSON.parse(res_str))
        const resultPath = path.join(process.cwd(), "views/result.html")
        var resultHTML = fs.readFileSync(resultPath, "utf-8")
        resultHTML = resultHTML.replace("<dir></dir>", "<dir><p>Transaction has been successed !</p></dir>")
        res.status(200).send(resultHTML)
        
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}
)

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)