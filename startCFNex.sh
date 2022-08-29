#!/bin/bash

set -e

# don't rewrite paths for Windows Git Bash users


# clean out any old identites in the wallets
rm -rf wallet/*

# launch network; create channel and join peer to channel

pushd .

./startnetwork.sh

sleep 20

./createchannelall.sh

sleep 20

./setAnchorPeerUpdateall.sh

sleep 20

./deployCCall.sh

sleep 20

popd