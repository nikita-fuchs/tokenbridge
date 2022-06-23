import { Directive, ElementRef, Renderer2, HostListener, } from '@angular/core';

@Directive({
  selector: '[toEtherscan]'
})
export class ToEtherscanDirective {



  @HostListener('mouseenter') onMouseEnter() {
     console.log("directive: in!")
   }
   
   @HostListener('mouseleave') onMouseLeave() {
   /*   console.log("directive: out!") */
   }
 
   constructor(private el: ElementRef, private renderer: Renderer2) {
     this.addUrl()
     console.log("initializing directive")
   }
 
    ngAfterViewInit() {
     this.addUrl()
    }
 
    ngOnInit(){
     //this.addUrl()
    }
 
    ngAfterContentInit(){
      //this.addUrl()
    }
 
    ngAfterViewChecked(){
      //this.addUrl()
    }
 
 
 
    addUrl(){
 
       let currentContent: string = this.el.nativeElement.innerText
   
       /* console.log("directive network id: ", currentNetwork)
       console.log("directive network id direct: ", this.compiler.Chain?.selectedNode.networkId)
       console.log("current content: ", currentContent)
       console.log("nur el: ", this.el.nativeElement) */
   
       var baseUrl: string = 'https://etherscan.io/address/'

       var middlewareLink: string;

       var ethereumAccountRegex = new RegExp(`/0x[a-fA-F0-9]{40}/g`, 'gm')

       if (!currentContent || typeof(currentContent) != "string") {
         return
       }

        if (currentContent.match(ethereumAccountRegex)) {
          middlewareLink = `${baseUrl}/address/${currentContent}`
                      // create new link
          const newLink = this.renderer.createElement('a');
          this.renderer.setAttribute(newLink, "href", middlewareLink)
          this.renderer.setAttribute(newLink, "target", "_blank")
          this.renderer.addClass(newLink, "middlewareLink")
          const text = this.renderer.createText(currentContent)
          
          // put the link into the element
          this.renderer.appendChild(newLink, text)
  
          //this.renderer.setAttribute(newLink, "innerText", "TEST TEST TEST")
    
          // delete the old content
          this.renderer.setProperty(this.el.nativeElement, "textContent", '')
  
          // append it to the element
          this.renderer.appendChild(this. el.nativeElement, newLink)
        }      
    }
}
