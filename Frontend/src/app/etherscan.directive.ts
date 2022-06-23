import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appEtherscan]'
})
export class EtherscanDirective {

  constructor(private el: ElementRef) {
    this.el.nativeElement.style.backgroundColor = 'yellow';
 }
}
