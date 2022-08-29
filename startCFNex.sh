#!/bin/bash

set -e

# don't rewrite paths for Windows Git Bash users


# clean out any old identites in the wallets
rm -rf wallet/*

# launch network; create channel and join peer to channel

pushd .

./startnetwork.sh

sleep 5

./createchannelall.sh

sleep 5

./setAnchorPeerUpdateall.sh

sleep 5

./deployCCall.sh

sleep 5

./application/ccp/ccp-generate.sh

popd