#!/bin/bash

if [[ -n "$USERNAME" ]] && [[ -n "$USERPWD" ]]
then
    killall transmission-daemon
    sed -i 's/"rpc-authentication-required": false/"rpc-authentication-required": true/g' /config/settings.json
    sed -i 's/"rpc-username": ""/"rpc-username": "'${USERNAME}'"/g' /config/settings.json
    sed -i 's/"rpc-password": ".*"/"rpc-password": "'${USERPWD}'"/g' /config/settings.json
	echo Done.
fi