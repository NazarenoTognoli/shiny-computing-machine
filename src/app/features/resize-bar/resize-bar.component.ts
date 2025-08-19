import { Component, HostListener, input, AfterViewInit, signal, output  } from '@angular/core';
import { ResizeService } from './resize.service';
import { toPixels, toPercentage } from '../../shared/utils/units-conversion';
import { CommonModule } from '@angular/common';

interface Init {
  clientX: number,
  clientY: number,
  offsetWidth: number,
  offsetHeight: number,
}

export interface ResizeConfig {
  y: {
    active: boolean,
    backward: boolean,
  };
  x: {
    active: boolean,
    backward: boolean,
  };
  elementSizePx: {
    current: {
      width: ()=>number,
      height: ()=>number,
    }
  };
}

const defaultConfig:ResizeConfig = {
  y: {
    active: false,
    backward: false,
  },
  x: {
    active: false,
    backward: false,
  },
  elementSizePx: {
    current: {
      width: ()=>0,
      height: ()=>0,
    }
  },
}

export interface OnMouseDownOutput {
  positionToRemove:PositionProperties;
  positionToApply:PositionProperties;
}

export interface OnMouseMoveOutput {
  width: number | null;
  height: number | null;
}

export interface OnMouseUpOutput {
  y:boolean;
  x:boolean;
  backward: (a: "x" | "y") => boolean;
}

export type PositionProperties =  "left" | "right" | "top" | "bottom";

@Component({
  selector: 'app-resize-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resize-bar.component.html',
  styleUrl: './resize-bar.component.scss'
})
export class ResizeBarComponent {

  constructor(private resize:ResizeService){}

  config = input<ResizeConfig>(defaultConfig);

  onMouseDownOutput = output<OnMouseDownOutput>();
  onMouseMoveOutput = output<any>();
  onMouseUpOutput = output<OnMouseUpOutput>();

  notifyOnMouseDownOutput(value:OnMouseDownOutput){
    this.onMouseDownOutput.emit(value);
    //console.log("notifyOnMouseDownOutput " + JSON.stringify(value));
  }

  notifyOnMouseMoveOutput(value:OnMouseMoveOutput){
    this.onMouseMoveOutput.emit(value);
    //console.log("notifyOnMouseMoveOutput " + JSON.stringify(value));
  }

  notifyOnMouseUpOutput(value:OnMouseUpOutput){
    this.onMouseUpOutput.emit(value);
  }

  y = () => this.config().y.active;
  x = () => this.config().x.active;
  backward = (a: 'x' | 'y') => this.config()[a].backward;

  init:Init = {
    clientX: 0,
    clientY: 0,
    offsetWidth: this.config().elementSizePx.current.width(),
    offsetHeight: this.config().elementSizePx.current.height(),  
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event:MouseEvent){
    document.body.classList.add('no-select');
    this.resize.isResizing = true;
    
    this.init = {
      clientX: event.clientX,
      clientY: event.clientY,
      offsetWidth: this.config().elementSizePx.current.width(),
      offsetHeight: this.config().elementSizePx.current.height(),
    }

    if (this.x() && !this.backward('x')){
      this.notifyOnMouseDownOutput({
        positionToRemove: 'right',
        positionToApply: 'left',
      });
    }
    else if (this.x() && this.backward('x')){
      this.notifyOnMouseDownOutput({
        positionToRemove: 'left',
        positionToApply: 'right',
      });
    }
    if (this.y() && !this.backward('y')){
      this.notifyOnMouseDownOutput({
        positionToRemove: 'bottom',
        positionToApply: 'top',
      });
    }
    else if (this.y() && this.backward('y')){
      this.notifyOnMouseDownOutput({
        positionToRemove: 'top',
        positionToApply: 'bottom',
      });
    }

    //element.style.removeProperty(propertyToRemove);
    //element.style[sideParam] = `calc(${defaultElementPositionPct - discrepancyToSubtractPct}%)`;
    
    window.addEventListener('mousemove', this.onMouseMoveBound);
    window.addEventListener('mouseup', this.onMouseUpBound);
  }

  private onMouseMoveBound = (event: MouseEvent) => this.onMouseMove(event);

  onMouseMove(event:MouseEvent){
    if(!this.resize.isResizing) return;

    const delta = {
      y: this.y() ? (event.clientY - this.init.clientY) : 0,
      x: this.x() ? (event.clientX - this.init.clientX) : 0, 
    }
    
    const refresh = {
      width: this.backward('x') ? this.init.offsetWidth - delta.x : this.init.offsetWidth + delta.x,
      height: this.backward('y') ? this.init.offsetHeight - delta.y : this.init.offsetHeight + delta.y,
    };
    
    this.notifyOnMouseMoveOutput({
      width: this.x() ? refresh.width : null,
      height: this.y() ? refresh.height : null,
    });
  }

  private onMouseUpBound = (event: MouseEvent) => this.onMouseUp(event);

  onMouseUp(event: MouseEvent) {
    this.resize.isResizing = false; 
    document.body.classList.remove('no-select');

    this.notifyOnMouseUpOutput({x:this.x(), y:this.y(), backward:this.backward});

    // Eliminamos el evento de mouseup global para evitar fugas de memoria
    window.removeEventListener('mousemove', this.onMouseMoveBound);
    window.removeEventListener('mouseup', this.onMouseUpBound);
  }

  ngAfterViewInit(){
    //console.log(this.config());
    //console.log(this.x());
    //console.log(this.y());
  }
}