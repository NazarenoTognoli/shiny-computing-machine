import { Component, HostListener, input, output } from '@angular/core';

export interface RepositionProperties {
  left: number;
  top: number;
  bottom: number;
  right: number;
}

const defaultRepositionProperties = {
  left: 0,
  top: 0,
  bottom: 0,
  right: 0,
}

interface Init {
  left: number;
  top: number;
  bottom: number;
  right: number;
  clientX: number;
  clientY: number;
}

@Component({
  selector: 'app-reposition',
  standalone: true,
  imports: [],
  templateUrl: './reposition.component.html',
  styleUrl: './reposition.component.scss'
})
export class RepositionComponent {
  elementPositionPxDefaultInput = input<RepositionProperties>(defaultRepositionProperties);
  elementPositionPxDefaultOutput = output<RepositionProperties>();
  
  init:Init = {
    clientX: 0,
    clientY: 0,
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  };

  notifyElementPositionPxDefaultOutput(value:RepositionProperties){
    this.elementPositionPxDefaultOutput.emit(value);
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event:MouseEvent){
    this.init = {
      left: this.elementPositionPxDefaultInput().left,
      top: this.elementPositionPxDefaultInput().top,
      right: this.elementPositionPxDefaultInput().right,
      bottom: this.elementPositionPxDefaultInput().bottom,
      clientX: event.clientX,
      clientY: event.clientY,
    };
    window.addEventListener('mousemove', this.onMouseMoveBound);
    window.addEventListener('mouseup', this.onMouseUpBound);
  }
  private onMouseMoveBound = (event: MouseEvent) => this.onMouseMove(event);
  onMouseMove(event:MouseEvent){
    const delta = {
      x: event.clientX - this.init.clientX,
      y: event.clientY - this.init.clientY,
    }

    const refresh = {
      left: this.init.left + delta.x,
      top: this.init.top + delta.y,
      right: this.init.right - delta.x,
      bottom: this.init.bottom - delta.y,
    }

    this.notifyElementPositionPxDefaultOutput(refresh);
  }
  private onMouseUpBound = (event: MouseEvent) => this.onMouseUp(event);
  onMouseUp(event:MouseEvent){
    window.removeEventListener('mousemove', this.onMouseMoveBound);
    window.removeEventListener('mouseup', this.onMouseUpBound);
  }
}
