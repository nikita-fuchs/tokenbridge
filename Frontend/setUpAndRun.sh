#!/bin/sh
export NODE_OPTIONS=--openssl-legacy-provider
cd /app/Blockchain 
npx truffle compile &&
truffle migrate --reset --network dockercompose && 
cd /app/Frontend &&
ng serve --host 0.0.0.0
