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

import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
//import { faSquare, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import {
  faSquare,
  faCheckSquare as farCheckSquare,
} from '@fortawesome/free-regular-svg-icons';
@NgModule({
  declarations: [
    AppComponent,
    ToEtherscanDirective,
    EtherscanDirective
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    // Add multiple icons to the library
    //@ts-ignore
    library.addIcons(  faSquare/* ,
      faCheckSquare,
      farSquare,
      farCheckSquare, */);
  }
 }
