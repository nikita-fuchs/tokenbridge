import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import {AppMaterialModule} from "./app-material.module";
import { AppRoutingModule } from './app-routing.module';
import {UiModule} from "./ui/ui.module";
import { ToEtherscanDirective } from './to-etherscan.directive';
import { EtherscanDirective } from './etherscan.directive';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'  
import { MatSortModule } from '@angular/material/sort/';
import { SnackbarMessageComponent } from './snackbar-message/snackbar-message.component';
@NgModule({
  declarations: [
    AppComponent,
    ToEtherscanDirective,
    EtherscanDirective,
    SnackbarMessageComponent
  ],
  imports: [
    AppRoutingModule,
    AppMaterialModule,
    BrowserModule,
    BrowserAnimationsModule,
    UiModule,
    MatTableModule,
    //MatTableDataSource,
    MatSortModule,
    MatTableModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatSortModule,
  ],
  providers: [{ provide: Window, useValue: window }],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {}
 }
