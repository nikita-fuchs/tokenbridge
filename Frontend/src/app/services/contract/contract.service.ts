import {Inject, Injectable} from '@angular/core';
import { WEB3 } from '../../core/web3';
//import contract from 'truffle-contract'; 
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

import Web3 from 'web3';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { SnackbarMessageComponent } from 'src/app/snackbar-message/snackbar-message.component';

const contract = require("@truffle/contract"); 

declare let require: any;
//const tokenAbi = require('../../../../../Blockchain/build/contracts/Payment.json');
const tokenAbi = require('../../../../../Blockchain/build/contracts/WrappedAeternity.json');
declare let window: any;
  
enum successType {
  minted = "minted",
  askOtherAdmin = "askOtherAdmin"
}

@Injectable({
  providedIn: 'root'
})

export class ContractService {
  public accountsObservable = new Subject<string[]>();
  public compatible: boolean;
  web3Modal;
  snackbarRef;
  web3js;
  provider;
  accounts;
  balance;
  instance; // the contract instance
  sigFetchInterval // interval for fetching signatures - one might want to clear it later maybe.
  defaultSignatures : string[] = ['0x41b1a0649752af1b28b3dc29a1556eee781e4a4c3a1f7f53f90fa834de098c4d',
                                '0x435cd288e3694b535549c3af56ad805c149f92961bf84a1c647f7d86fc2431b4',
                                '0xf2d05ec5c5729fb559780c70a93ca7b4ee2ca37f64e62fa31046b324f60d9447'] // the default signatures. introduced so signatures don't match right away after contract deployment.

  contractState : AdminData[] = [
    {position: 1, address: '', currentSignature: ''},
    {position: 2, address: '', currentSignature: ''},
    {position: 3, address: '', currentSignature: ''},
  ]


  displayedColumns: string[] = ['address', 'currentSignature'];
  dataSource = this.contractState;

  constructor(@Inject(WEB3) private web3: Web3 ,private snackbar: MatSnackBar) {

      // for testing/debugging the snackbar
  /*   this.snackbarRef = this.snackbar.openFromComponent(SnackbarMessageComponent,
      {
        data: { 
          header: "Minting successfull !",
          firstLine: `Minted 1337 tokens to `,
          secondLine: `0xa152F8bb749c55E9943A3a0A3111D18ee2B3f94E`,
          txId: '0xa152F8bb749c55E9943A3a0A3111D18ee2B3f94E',
          messageType: "minted",
          theSnackbar : this.snackbarRef
        },
        duration : 8000000
      }) */


    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: "27e484dcd9e3efcfd25a83a78777cdf1" // required
        }
      }
    };

    this.web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions, // required
      theme: {
        background: "rgb(39, 49, 56)",
        main: "rgb(199, 199, 199)",
        secondary: "rgb(136, 136, 136)",
        border: "rgba(195, 195, 195, 0.14)",
        hover: "rgb(16, 26, 32)"
      }
    });
  }


  async connectAccount() {


    this.provider = await this.web3Modal.connect(); // set provider
    this.web3js = new Web3(this.provider); // create web3 instance
    this.accounts = await this.web3js.eth.getAccounts();
    console.log("active account :", this.accounts[0])
    // set up the contract
    const paymentContract = contract(tokenAbi);
    paymentContract.setProvider(this.provider);
    this.instance = await paymentContract.deployed();

    //deleteme
  /*   const snackbarRef = this.snackbar.open(`test `);
    setTimeout(() => {
      snackbarRef.dismiss()
    }, 3000); */

    // get the admins
    this.contractState[0].address = await this.instance.admin1();
    this.contractState[1].address = await this.instance.admin2();
    this.contractState[2].address = await this.instance.admin3();

    //get the signatures
    this.contractState[0].currentSignature = await this.instance.multiSigHashes(this.contractState[0].address);
    this.contractState[1].currentSignature = await this.instance.multiSigHashes(this.contractState[1].address);
    this.contractState[2].currentSignature = await this.instance.multiSigHashes(this.contractState[2].address);
    
    this.sigFetchInterval = setInterval(async () => {
      this.contractState[0].currentSignature = await this.instance.multiSigHashes(this.contractState[0].address);
      this.contractState[1].currentSignature = await this.instance.multiSigHashes(this.contractState[1].address);
      this.contractState[2].currentSignature = await this.instance.multiSigHashes(this.contractState[2].address);
    }, 5000) 

    return this.accounts;
  }

  async accountInfo(accounts){
    const initialvalue = await this.web3js.eth.getBalance(accounts[0]);
    this.balance = this.web3js.utils.fromWei(initialvalue , 'ether');
    return this.balance;
  }


  async mintTokens(targetAccount, amount) {

    return new Promise(async (resolve, reject) => {

    try{ 
      let result = await this.instance.mint(targetAccount, amount, {gas: 250000/* , gasPrice: Web3.utils.toWei("50", "gwei") */, from:this.accounts[0]})
      console.log("transaction results:", result)

      //see if the transaction was a minting, or another admin needs to be asked.
      let minted = result.logs.find(log => log.event == "wrapped")


      if (minted) {
        /* this.successMessage(successType.minted, targetAccount, result.tx, amount)  */
/*         this.snackbarRef = this.snackbar.openFromComponent(`Minted ${amount} tokens to ${targetAccount}! (tx id: ${result.tx})`, "View in Etherscan", { duration: 10000 }); */
            this.snackbarRef = this.snackbar.openFromComponent(SnackbarMessageComponent,
                {
                  data: { 
                    header: "Minting successfull !",
                    firstLine: `Minted ${amount} tokens to `,
                    secondLine: `${targetAccount}`,
                    txId: result.tx,
                    messageType: "minted",
                    theSnackbar : this.snackbarRef
                  },
                  duration : 8000
                })
        
/*         this.snackbarRef.afterDismissed().subscribe(() => {
          this.goToLink(`https://etherscan.io/tx/${result.tx}`)
        }); */

/* 
        setTimeout(() => {
          this.snackbarRef.dismiss()
        }, 3000); */

      } else {
/* 
        this.snackbarRef.afterDismissed().subscribe(() => {
          this.goToLink(`https://etherscan.io/tx/${result.tx}`)
        }); */

        this.snackbarRef = this.snackbar.openFromComponent(SnackbarMessageComponent,
          {
            data: { 
              header: "Setting Signature Successful",
              firstLine: "Now ask any of the other admins to approve ",
              secondLine: "the same amount of tokens to this recipient",
              txId: result.tx,
              messageType: "signed"
            },
            duration : 8000
          })
      }


      return resolve({status: true});
      } catch(error) {

        this.snackbarRef = this.snackbar.open(`Something about the transaction errored, did you pick the right wallet and reload the page?`, "View in Etherscan", { duration: 10000 })
        return reject('Error sending mint transaction:, error');
      }
  });
  }


  failure(message: string) {
    const snackbarRef = this.snackbar.open(message);
    snackbarRef.dismiss()
  }

 /*    successMessage(type: successType, to: string, txId: string, amount: number) {
      if (type == successType.minted){
        const snackbarRef = this.snackbar.open(`Minted ${amount} tokens to ${to}! (tx id: ${txId}) `);
        setTimeout(() => {
          snackbarRef.dismiss()
        }, 3000);
      } else {
        const snackbarRef = this.snackbar.open(`Setting signature successful. Ask another Admin to mint ${amount} tokens to ${to} to complete the minting! (tx id: ${txId}) `);
        setTimeout(() => {
          snackbarRef.dismiss()
        }, 3000);
      }
      
    } */
  
    goToLink(url: string){
      window.open(url, "_blank");
  }



}



export interface AdminData {
  position: number,
  address: string;
  currentSignature: string;
}


/// todo: "no signature yet"

///todo: include ae address in tx payload