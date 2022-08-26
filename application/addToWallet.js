const fs = require("fs");
const { Wallets } = require("fabric-network");
const path = require("path");

async function main() {
    // Main try/catch block
    try {
        // A wallet stores a collection of identities
        const wallet = await Wallets.newFileSystemWallet("wallet");

        const checkidentity = await wallet.get("appUser");
        if (checkidentity) {
            console.log(
                'An identity for the user "appUser" already exists in the wallet'
            );
            return;
        }

        const checkidentity2 = await wallet.get("appUser2");
        if (checkidentity) {
            console.log(
                'An identity for the user "appUser2" already exists in the wallet'
            );
            return;
        }

        const checkidentity3 = await wallet.get("appUser3");
        if (checkidentity) {
            console.log(
                'An identity for the user "appUser3" already exists in the wallet'
            );
            return;
        }

        const checkidentity4 = await wallet.get("appUser4");
        if (checkidentity) {
            console.log(
                'An identity for the user "appUser4" already exists in the wallet'
            );
            return;
        }

        const checkidentity5 = await wallet.get("appUser5");
        if (checkidentity) {
            console.log(
                'An identity for the user "appUser5" already exists in the wallet'
            );
            return;
        }

        // Identity to credentials to be stored in the wallet
        const credPath = path.join(__dirname, "/msp");
        const certificate = fs
            .readFileSync(
                path.join(
                    credPath,
                    "/org1.example.com/users/signcerts/User1@org1.example.com-cert.pem"
                )
            )
            .toString();
        const certificate2 = fs
            .readFileSync(
                path.join(
                    credPath,
                    "/org2.example.com/users/signcerts/User2@org2.example.com-cert.pem"
                )
            )
            .toString();
        const certificate3 = fs
            .readFileSync(
                path.join(
                    credPath,
                    "/org3.example.com/users/signcerts/User3@org3.example.com-cert.pem"
                )
            )
            .toString();
        const certificate4 = fs
            .readFileSync(
                path.join(
                    credPath,
                    "/org4.example.com/users/signcerts/User4@org4.example.com-cert.pem"
                )
            )
            .toString();
        const certificate5 = fs
            .readFileSync(
                path.join(
                    credPath,
                    "/org5.example.com/users/signcerts/User5@org5.example.com-cert.pem"
                )
            )
            .toString();
        const privateKey = fs
            .readFileSync(
                path.join(credPath, "/org1.example.com/users/keystore/priv_sk")
            )
            .toString();
        const privateKey2 = fs
            .readFileSync(
                path.join(credPath, "/org2.example.com/users/keystore/priv_sk")
            )
            .toString();
        const privateKey3 = fs
            .readFileSync(
                path.join(credPath, "/org3.example.com/users/keystore/priv_sk")
            )
            .toString();
        const privateKey4 = fs
            .readFileSync(
                path.join(credPath, "/org4.example.com/users/keystore/priv_sk")
            )
            .toString();
        const privateKey5 = fs
            .readFileSync(
                path.join(credPath, "/org5.example.com/users/keystore/priv_sk")
            )
            .toString();

        // Load credentials into wallet
        const identityLabel = "appUser";
        const identityLabel2 = "appUser2";
        const identityLabel3 = "appUser3";
        const identityLabel4 = "appUser4";
        const identityLabel5 = "appUser5";

        const identity = {
            credentials: {
                certificate,
                privateKey,
            },
            mspId: "Org1MSP",
            type: "X.509",
        };
        const identity2 = {
            credentials: {
                certificate,
                privateKey,
            },
            mspId: "Org2MSP",
            type: "X.509",
        };
        const identity3 = {
            credentials: {
                certificate,
                privateKey,
            },
            mspId: "Org3MSP",
            type: "X.509",
        };
        const identity4 = {
            credentials: {
                certificate,
                privateKey,
            },
            mspId: "Org4MSP",
            type: "X.509",
        };
        const identity5 = {
            credentials: {
                certificate,
                privateKey,
            },
            mspId: "Org5MSP",
            type: "X.509",
        };

        await wallet.put(identityLabel, identity);
        console.log('Successfully import an user("appUser") into the wallet');
        await wallet.put(identityLabel2, identity2);
        console.log('Successfully import an user("appUser2") into the wallet');
        await wallet.put(identityLabel3, identity3);
        console.log('Successfully import an user("appUser3") into the wallet');
        await wallet.put(identityLabel4, identity4);
        console.log('Successfully import an user("appUser4") into the wallet');
        await wallet.put(identityLabel5, identity5);
        console.log('Successfully import an user("appUser5") into the wallet');
    } catch (error) {
        console.log(`Error adding to wallet. ${error}`);
        console.log(error.stack);
    }
}

main();
