import { Component, HostListener, input, AfterViewInit, signal, output  } from '@angular/core';
import { ResizeService } from './resize.service';
import { toPixels } from '../../shared/utils/units-conversion';
import { CommonModule } from '@angular/common';

interface Init {
  clientX: number;
  clientY?: number;
  offsetWidth: number;
  offsetHeight?: number;
}
export interface Axis {
  xy: boolean;
  y: boolean;
}

export interface CurrentSize {
  width: number;
  height: number; 
}

@Component({
  selector: 'app-resize-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resize-bar.component.html',
  styleUrl: './resize-bar.component.scss'
})
export class ResizeBarComponent {

  constructor(private resize:ResizeService){}

  axis = input<Axis>({y: false, xy: false});
  elementCurrentSize = input<any>();
  updateCurrentSize = output<CurrentSize>();

  notifyCurrentSizeChange(value:CurrentSize){
    this.updateCurrentSize.emit(value);
  }

  init:Init = {offsetWidth: 0, clientX: 0}

  @HostListener('mousedown', ['$event'])
  onMouseDown(event:MouseEvent){
    console.log("executed mousedown")
    this.resize.isResizing = true;
    this.init.clientX = event.clientX;
    this.init.offsetWidth = this.elementCurrentSize()();
    document.body.classList.add('no-select');
    window.addEventListener('mousemove', this.onMouseMoveBound);
    window.addEventListener('mouseup', this.onMouseUpBound);
  }

  private onMouseMoveBound = (event: MouseEvent) => this.onMouseMove(event);

  onMouseMove(event:MouseEvent){
    if(!this.resize.isResizing) return;
    const newValue = () => this.init.offsetWidth + (event.clientX - this.init.clientX);
    if (newValue() >= window.innerWidth + 1) return;
    if (newValue() <= 1) return;
    this.notifyCurrentSizeChange({width:newValue(), height: 0});
  }

  private onMouseUpBound = (event: MouseEvent) => this.onMouseUp(event);

  onMouseUp(event: MouseEvent) {
    console.log("executed mouseup");
    this.resize.isResizing = false; 
    document.body.classList.remove('no-select');
    // Eliminamos el evento de mouseup global para evitar fugas de memoria
    window.removeEventListener('mousemove', this.onMouseMoveBound);
    window.removeEventListener('mouseup', this.onMouseUpBound);
  }
  ngAfterViewInit(){
    //this.editor.editorWidthPxState.set(this.primaryElementCurrentWidth()());
  }
}
