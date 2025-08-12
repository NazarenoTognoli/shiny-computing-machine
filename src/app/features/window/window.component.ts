import { Component } from '@angular/core';
import { ResizeBarComponent } from '../resize-bar/resize-bar.component';
@Component({
  selector: 'app-window',
  standalone: true,
  imports: [ResizeBarComponent],
  templateUrl: './window.component.html',
  styleUrl: './window.component.scss'
})
export class WindowComponent {

}
/*
   F. se encesita de para calcular relaciones, de forma natural debería ser el viewport, 
   la vision natural es que por default haya un dashboard renderizandose de fondo.
    
  
*/