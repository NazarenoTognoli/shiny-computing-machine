import { Component, HostListener, input, AfterViewInit, ElementRef, Host, signal, effect  } from '@angular/core';
import { CommonModule } from '@angular/common';
//Components
import { ResizeBarComponent } from '../resize-bar/resize-bar.component';
//UTILS 
import { toPixels, toPercentage } from '../../shared/utils/units-conversion';
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
  height = signal<number>(toPixels(60, window.innerHeight));

  constructor(@Host() public hostElement: ElementRef){
    effect(() => {
      const el = this.hostElement.nativeElement;
      el.style.width = `${toPercentage(this.width())}%`;
    });
    effect(() => {
      const el = this.hostElement.nativeElement;
      el.style.height = `${toPercentage(this.height(), window.innerHeight)}%`;
    });
  }
  
  getCurrentWidth = () => this.hostElement.nativeElement.getBoundingClientRect().width;
  getCurrentHeight = () => this.hostElement.nativeElement.getBoundingClientRect().height;
  
  handleUpdateCurrentWidth(value:CurrentSize){
    if (value.width){
      this.width.set(value.width);
    }
    if (value.height){
      this.height.set(value.height);
    }
    console.log("handleUpdateCurrentWidth");
  }
}
/*
   F. se encesita de para calcular relaciones, de forma natural debería ser el viewport, 
   la vision natural es que por default haya un dashboard renderizandose de fondo.
    
  
*/