import {Inject, Injectable} from '@angular/core';
import { WEB3 } from '../../core/web3';
//import contract from 'truffle-contract'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

import Web3 from 'web3';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

const contract = require("@truffle/contract"); 

declare let require: any;
//const tokenAbi = require('../../../../../Blockchain/build/contracts/Payment.json');
const tokenAbi = require('../../../../../Blockchain/build/contracts/WrappedAeternity.json');
declare let window: any;


@Injectable({
  providedIn: 'root'
})

export class ContractService {
  public accountsObservable = new Subject<string[]>();
  public compatible: boolean;
  web3Modal;
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


  async transferEther(originAccount, targetAccount, amount) {

    return new Promise(async (resolve, reject) => {

    try{ 

      let result = await this.instance.mint(targetAccount, amount, {from:this.accounts[0]})
      console.log(result)
      return resolve({status: true});
      } catch(error) {
        return reject('Error transfering Ether');
      }
      

      

      /* 
      let finalAmount =  this.web3.utils.toBN(amount)
      console.log("final amount;", finalAmount)
      
      try {
        let status = await this.instance.newTransaction(
          targetAccount,
          {
            from: originAccount[0],
            value: this.web3.utils.toWei(finalAmount, 'ether')
          }
          );

          if (status) {
            return resolve({status: true});
          }
      } catch(error) {
          console.log(error);
          return reject('Error transfering Ether');
      }
     */});
  }


  failure(message: string) {
    const snackbarRef = this.snackbar.open(message);
    snackbarRef.dismiss()
  }

  success() {
    const snackbarRef = this.snackbar.open('Transaction completed successfully');
    snackbarRef.dismiss()
    
    async function getStaticData() {
      // fetch the addresses of the 3 admins
      //let result = await this.instance.admin1();
      debugger
    }
    
    function startFetchingPeriodicData() {
      throw new Error('Function not implemented.');
    }
  }
}


export interface AdminData {
  position: number,
  address: string;
  currentSignature: string;
}


/// todo: "no signature yet"

///todo: include ae address in tx payload