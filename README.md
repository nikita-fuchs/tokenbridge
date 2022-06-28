This is the manual token bridge. It has a multi-signature smart contract.
It requires two out of three admins to perform the same transaction (recipient, amount) after each other to mint tokens to some recipient. For that, the front-end is to be used.

## Run locally
The whole dApp can be run locally. The provided docker-compose setup will spawn a sandbox ethereum chain (`ganache`), compile the contracts (WrappedAeternity token with multi-sig), deploy them to the sandbox chain, build the artifacts necessary to interact with the contract, build the frontend and serve it locally at http://localhost:4200.

### Instructions to run locally

1. clone this repository
2. open terminal in this directory and run `docker-compose up`. Once you see `
frontend_1  | ✔ Compiled successfully.` the  dApp was successfully built
3. Open your MetaMask and add the following URL as network/RPC provider: `http://localhost:8545` 
4. In your metamask, add the following three private keys. They correspond to the accounts set to be `admins` in the multi-sig:

`0x606b0ddf70c7065f3ec83fe5edbdba8a97eb32c4dff90cc96f34fd5aca7a3373`
`0x7d157c15ad4d54f95cf96dbb413e510632389a8e980bffd4ca2b7649d060f6e1`
`0xa25e54bebe6588febb9516c862be47e08740c73ebc65333f647f28f05457d160`

5. Set one of the admin accounts as the active account in Metamask.
6. Open http://localhost:4200 and let metamask connect.
7. In the form fields, enter some address and an amount, and click send.

8. repeat step 5 till 7 with another admin account. please do not forget to reload your browser.

9. if two admin accounts did a transaction with the same values after each other, the recipient will have received newly minted tokens and the signatures will be reset.

# TODO:
- add visual confirmation for successful minting.
- consider adding recipient's wallet address as transaction parameter, to be logged in the `mint` event in the contract.
- add a form field to check account balances, for easier verification.


