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

./createchannel.sh

./createchannel2.sh

./createchannel3.sh

./createchannel4.sh

./createchannel5.sh

sleep 5

./setAnchorPeerUpdateall.sh

./setAnchorPeerUpdate.sh

./setAnchorPeerUpdate2.sh

./setAnchorPeerUpdate3.sh

./setAnchorPeerUpdate4.sh

./setAnchorPeerUpdate5.sh

sleep 5

./deployCCall.sh

./deployCC.sh

./deployCC2.sh

./deployCC3.sh

./deployCC4.sh

./deployCC5.sh

sleep 5

./application/ccp/ccp-generate.sh

popd