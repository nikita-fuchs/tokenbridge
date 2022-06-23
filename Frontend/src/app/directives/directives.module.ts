import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Directive, ElementRef, Renderer2, HostListener, } from '@angular/core';




@Directive({
  selector: '[toEtherscan]'
})
export class ToEtherscanDirective {
  
  added = false

  @HostListener('mouseenter') onMouseEnter() {
     //console.log("directive: in!")
   }
   
   @HostListener('mouseleave') onMouseLeave() {
   /*   console.log("directive: out!") */
   
   }
 
   constructor(private el: ElementRef, private renderer: Renderer2) {
     //console.log("initializing directive")
   }
 
    ngAfterViewInit() {

    }
 
    ngOnInit(){

    }
 
    ngAfterContentInit(){

    }
 
    ngAfterViewChecked(){

      !this.added? this.addUrl() : true
    }
 
 
 
    addUrl(){
 
       let currentContent: string = this.el.nativeElement.innerText
   
       /* console.log("directive network id: ", currentNetwork)
       console.log("directive network id direct: ", this.compiler.Chain?.selectedNode.networkId)
       console.log("current content: ", currentContent)
       console.log("nur el: ", this.el.nativeElement) */
   
       var baseUrl: string = 'https://etherscan.io'

       var middlewareLink: string;

       if (!currentContent || typeof(currentContent) != "string") {
         return
       }

        if (currentContent.match(/0x[a-fA-F0-9]{40}/gm)) {
          middlewareLink = `${baseUrl}/address/${currentContent}`
        // create new link
          const newLink = this.renderer.createElement('a');
          this.renderer.setAttribute(newLink, "href", middlewareLink)
          this.renderer.setAttribute(newLink, "target", "_blank")
          this.renderer.addClass(newLink, "etherscanLink")
          const text = this.renderer.createText(currentContent)
          
          // put the link into the element
          this.renderer.appendChild(newLink, text)
          //this.renderer.setAttribute(newLink, "innerText", "TEST TEST TEST")
    
          // delete the old content
          this.renderer.setProperty(this.el.nativeElement, "textContent", '')
  
          // append it to the element
          this.renderer.appendChild(this. el.nativeElement, newLink)
          this.added = true
        }      
    }
}


@NgModule({
  declarations: [ToEtherscanDirective],
  imports: [],
  exports: [ToEtherscanDirective]
})
export class DirectivesModule { }

