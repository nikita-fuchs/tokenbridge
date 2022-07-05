import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { ContractService } from "src/app/services/contract/contract.service";
import { DirectivesModule } from "src/app/directives/directives.module";


@Component({
  selector: "app-transaction",
  templateUrl: "./transaction.component.html",
  styleUrls: ["./transaction.component.scss"],
})
export class TransactionComponent implements OnInit {
  address: string;
  amount: number;
  direction: any;
  transactionForm: FormGroup;

  constructor(private fb: FormBuilder, public contract: ContractService) {
    this.transactionForm = new FormGroup({
        sendaddress: new FormControl("", [Validators.required, this.ethAddressRegexCheck()]),
        amount: new FormControl("", [Validators.required]),
      });


    contract
      .connectAccount()
      .then((value: any) => {
        this.direction = value;
      })
      .catch((error: any) => {
        console.log(error);
        
        contract.failure(
          "Could't get the account data, please check if metamask is running correctly and refresh the page"
        );
      });
  }

  ngOnInit(): void {
    this.transactionForm.get("sendaddress").valid
    this.transactionForm.valueChanges.subscribe((x) => {
    });
  }

  mintTokens(e) {
    //console.log(e);
    this.address = this.transactionForm.value.sendaddress;
    this.amount = this.transactionForm.value.amount;

    this.contract
      .mintTokens(this.address, this.amount)
      .then((r) => {
        console.log(r);
        //this.contract.success();
        this.transactionForm.controls['amount'].setValue(null)
        this.transactionForm.controls['sendaddress'].setValue(null)
        this.transactionForm.markAsPristine()
      })
      .catch((e) => {
        console.log(e);
        this.contract.failure("Transaction failed");
      });
  }


  ethAddressRegexCheck(): ValidatorFn {
    return (control:AbstractControl) : { [key: string]: any } | null => {
        const value = control.value;

        if (!value) {
            return null;
        }

        const isEthAddress = /0x[a-fA-F0-9]{40}/.test(value);
        return !isEthAddress ? {malformattedAddress: value}: null;
    }
  }


}




