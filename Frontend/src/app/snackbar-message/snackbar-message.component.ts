import { Component, OnInit, Inject } from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';


@Component({
  selector: 'snackbar-message',
  templateUrl: './snackbar-message.component.html',
  styleUrls: ['./snackbar-message.component.scss']
})
export class SnackbarMessageComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any, public window: Window) { }

  ngOnInit(): void {

  }

  navigateTo(url: string){
    this.window.open(url)
  }
}
