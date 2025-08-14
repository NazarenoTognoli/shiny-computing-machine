import { Component, HostListener, input, AfterViewInit, signal, output  } from '@angular/core';
import { ResizeService } from './resize.service';
import { toPixels } from '../../shared/utils/units-conversion';
import { CommonModule } from '@angular/common';

interface Init {
  clientX: number;
  clientY: number;
  offsetWidth: number;
  offsetHeight: number;
}
export interface Config {
  y: {
    active: boolean,
    backward: boolean,
  };
  x: {
    active: boolean,
    backward: boolean,
  };
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

  config = input<Config>({y: {active: false, backward: false}, x: {active: true, backward: true}});

  elementCurrentWidth = input<any>(()=>0);
  elementCurrentHeight = input<any>(()=>0);

  updateCurrentSize = output<CurrentSize>();

  notifyCurrentSizeChange(value:CurrentSize){
    this.updateCurrentSize.emit(value);
  }
  //element.style.left = `calc(25% - ${discrepancyToSubtract}%)`; 25% is default value of property
  //leftProperty.width = element.offsetWidth - rightProperty.discrepancy / 100 * container.offsetWidth;
  //leftProperty.discrepancy = leftProperty.width / container.offsetWidth * 100 - 50;

  init:Init = {
    clientX: 0,
    clientY: 0,
    offsetWidth: this.elementCurrentWidth()(),
    offsetHeight: this.elementCurrentHeight()(),
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event:MouseEvent){
    document.body.classList.add('no-select');
    console.log("executed mousedown")
    this.resize.isResizing = true;
    
    this.init = {
      clientX: event.clientX,
      clientY: event.clientY,
      offsetWidth: this.elementCurrentWidth()(),
      offsetHeight: this.elementCurrentHeight()(),
    }
    
    
    window.addEventListener('mousemove', this.onMouseMoveBound);
    window.addEventListener('mouseup', this.onMouseUpBound);
  }

  private onMouseMoveBound = (event: MouseEvent) => this.onMouseMove(event);

  onMouseMove(event:MouseEvent){
    if(!this.resize.isResizing) return;

    const y = this.config().y.active;
    const x = this.config().x.active;
    const xBackward = this.config().x.backward;
    const yBackward = this.config().y.backward;


    const delta = {
      y: y ? (event.clientY - this.init.clientY) : 0,
      x: x ? (event.clientX - this.init.clientX) : 0, 
    } 
    
    const newValue = () => (
      {
        width: xBackward ? this.init.offsetWidth - delta.x : this.init.offsetWidth + delta.x,
        height: yBackward ? this.init.offsetHeight - delta.y : this.init.offsetHeight + delta.y,
      }
    );
    
    if (newValue().width >= window.innerWidth + 1 && x) return;
    if (newValue().width >= window.innerWidth + 1 && x) return;

    if (newValue().height <= 1 && y) return;
    if (newValue().height <= 1 && y) return;
    
    this.notifyCurrentSizeChange({width: x ? newValue().width : 0, height: y ? newValue().height : 0});
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