import { Component, HostListener, input, AfterViewInit, ElementRef, Host, signal, effect  } from '@angular/core';
import { CommonModule } from '@angular/common';
//Components
import { ResizeBarComponent } from '../resize-bar/resize-bar.component';
//UTILS 
import { toPixels } from '../../shared/utils/units-conversion';
//INterface
import { CurrentSize } from '../resize-bar/resize-bar.component';

@Component({
  selector: 'app-window',
  standalone: true,
  imports: [ResizeBarComponent, CommonModule],
  templateUrl: './window.component.html',
  styleUrl: './window.component.scss'
})
export class WindowComponent {
  width = signal<number>(toPixels(60));

  constructor(@Host() public hostElement: ElementRef){
    effect(() => {
      // Obtenemos el elemento nativo del DOM.
      const el = this.hostElement.nativeElement;
      // Aplicamos el valor del signal al estilo 'width'.
      // Usamos el método `width()` para obtener el valor actual del signal.
      el.style.width = `${this.width()}px`;
    });
  }
  
  getCurrentWidth = () => this.hostElement.nativeElement.getBoundingClientRect().width;
  
  handleUpdateCurrentWidth(value:CurrentSize){
    this.width.set(value.width);
    console.log("handleUpdateCurrentWidth");
  }
}
/*
   F. se encesita de para calcular relaciones, de forma natural debería ser el viewport, 
   la vision natural es que por default haya un dashboard renderizandose de fondo.
    
  
*/