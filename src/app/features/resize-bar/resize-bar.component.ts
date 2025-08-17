import { Component, HostListener, input, AfterViewInit, signal, output  } from '@angular/core';
import { ResizeService } from './resize.service';
import { toPixels, toPercentage } from '../../shared/utils/units-conversion';
import { CommonModule } from '@angular/common';
//Interface
import { Ctx } from '../window/window.component';

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
  elementSizePct: {
    default: {
      width: number,
      height: number,
    },
  };
  elementPositionPct: {
    default: {
      left: number,
      top: number,
      bottom: number,
      right: number,
    },
  };
  container: {offsetHeight?: number, offsetWidth?: number, innerWidth?:number, innerHeight?:number};
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
  elementSizePct: {
    default: {
      width: 60,
      height: 60,
    }
  },
  elementPositionPct: {
    default: {
      left: 20,
      top: 20,
      bottom: 20,
      right: 20,
    },
  },
  container: window
}

const defaultCtx:Ctx = {
  elementPositionPct: {
    discrepancy: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    }
  },
  elementPositionPx: {
    delta: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    } 
  }
}

export interface OnMouseDownOutput {
  positionToRemove:PositionProperties;
  positionToApply:PositionProperties;
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
  ctx = input<Ctx>(defaultCtx);

  onMouseDownOutput = output<OnMouseDownOutput>();
  onMouseMoveOutput = output<any>();
  onMouseUpOutput = output<any>();

  notifyOnMouseDownOutput(value:OnMouseDownOutput){
    this.onMouseDownOutput.emit(value);
    //console.log("notifyOnMouseDownOutput " + JSON.stringify(value));
  }

  notifyOnMouseMoveOutput(value:any){
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
    
    const newValue = () => (
      {
        width: this.backward('x') ? this.init.offsetWidth - delta.x : this.init.offsetWidth + delta.x,
        height: this.backward('y') ? this.init.offsetHeight - delta.y : this.init.offsetHeight + delta.y,
      }
    );
    
    this.notifyOnMouseMoveOutput({
      width: this.x() ? newValue().width : null,
      height: this.y() ? newValue().height : null,
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