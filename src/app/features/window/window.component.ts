import { Component, HostListener, ElementRef, Host, AfterViewInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
//Components
import { ResizeBarComponent } from '../resize-bar/resize-bar.component';
//UTILS 
import { toPixels, toPercentage } from '../../shared/utils/units-conversion';
//Types
import { OnMouseDownOutput, OnMouseUpOutput, ResizeConfig, PositionProperties } from '../resize-bar/resize-bar.component';

export interface Ctx { //CTX SHOULD BE IN A HIGHER LEVEL OF CONTEXT BY AXIS
  elementPositionPct: {
    discrepancy: {
      left: number,
      top: number,
      right: number,
      bottom: number,
    }
  };
  elementPositionPx: {
    delta: {
      left: number,
      top: number,
      right: number,
      bottom: number,
    }
  };
}

@Component({
  selector: 'app-window',
  standalone: true,
  imports: [ResizeBarComponent, CommonModule],
  templateUrl: './window.component.html',
  styleUrl: './window.component.scss'
})
export class WindowComponent {

  container = window;
  containerWidth = this.container.innerWidth;
  containerHeight = this.container.innerHeight;

  ctx = signal<Ctx>({
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
  });

  constructor(@Host() public hostElement: ElementRef){}
  
  resizeConfig:ResizeConfig = {
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
        width: () => this.hostElement.nativeElement.getBoundingClientRect().width,
        height: () => this.hostElement.nativeElement.getBoundingClientRect().height,
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
    container: this.container,
  }

  // Configuraciones específicas para cada <app-resize-bar>
  configRow1Col1: ResizeConfig = {
    ...this.resizeConfig,
    y: { active: true, backward: true },
    x: { active: true, backward: true },
  };

  configRow1Col2: ResizeConfig = {
    ...this.resizeConfig,
    y: { active: true, backward: true },
    x: { active: false, backward: false },
  };

  configRow1Col3: ResizeConfig = {
    ...this.resizeConfig,
    y: { active: true, backward: true },
    x: { active: true, backward: false },
  };

  configRow2Col1: ResizeConfig = {
    ...this.resizeConfig,
    y: { active: false, backward: false },
    x: { active: true, backward: true },
  };

  configRow2Col3: ResizeConfig = {
    ...this.resizeConfig,
    y: { active: false, backward: false },
    x: { active: true, backward: false },
  };

  configRow3Col1: ResizeConfig = {
    ...this.resizeConfig,
    y: { active: true, backward: false },
    x: { active: true, backward: true },
  };

  configRow3Col2: ResizeConfig = {
    ...this.resizeConfig,
    y: { active: true, backward: false },
    x: { active: false, backward: false },
  };

  configRow3Col3: ResizeConfig = {
    ...this.resizeConfig,
    y: { active: true, backward: false },
    x: { active: true, backward: false },
  };

  handleOnMouseDownOutput({positionToRemove, positionToApply}:OnMouseDownOutput){
    //console.log("handleOnMouseDownOutput " + JSON.stringify({positionToRemove:positionToRemove, positionToApply:positionToApply, discrepancyPct:discrepancyPct, defaultPositionPct:defaultPositionPct}));
    const discrepancyPct = this.ctx().elementPositionPct.discrepancy[positionToApply];
    const defaultPositionPct = this.resizeConfig.elementPositionPct.default[positionToApply];
    const el = this.hostElement.nativeElement;
    
    el.style.removeProperty(positionToRemove);
    el.style[positionToApply] = `calc(${defaultPositionPct - discrepancyPct}%)`;

    console.log("discrepancyPct." + positionToRemove + ": " + discrepancyPct);
    console.log("default - discrepancy: " + (defaultPositionPct - discrepancyPct));
  }

  handleOnMouseMoveOutput({width, height}:{width: number | null, height: number | null}){
    //console.log("handleOnMouseMoveOutput-width:" + JSON.stringify(width) + "-height:" + JSON.stringify(height));
    const el = this.hostElement.nativeElement;
    if (width !== null){
      el.style.width = `${toPercentage(width, this.containerWidth)}%`;
    }
    if (height !== null){
      el.style.height = `${toPercentage(height, this.containerHeight)}%`;
    }
  }

  handleOnMouseUpOutput({ x, y, backward }: OnMouseUpOutput) {
    const ctx = this.ctx();
    const updatedCtx: Ctx = { ...ctx };

    const rawContainer = this.resizeConfig.container;
    
    const containerX = rawContainer.offsetWidth ? rawContainer.offsetWidth : window.innerWidth;
    const containerY = rawContainer.offsetHeight ? rawContainer.offsetHeight : window.innerHeight;

    const container = (a: 'width' | 'height' | PositionProperties) =>
    a === 'width' || a === 'left' || a === 'right' ? containerX : containerY;   
    
    const elSizePx = (a: 'width' | 'height') => this.resizeConfig.elementSizePx.current[a]();
    const defaultElSizePct = (a: 'width' | 'height') => this.resizeConfig.elementSizePct.default[a]; 
    const discrepancyPx = (a: PositionProperties) => toPixels(updatedCtx.elementPositionPct.discrepancy[a], container(a));
    const elPositionPct = (a: PositionProperties) => toPercentage(updatedCtx.elementPositionPx.delta[a], container(a));
     

    if (x && !backward('x')){ //PROBLEM: DISCREPANCY HAS NO ACCESS TO UPDATED DELTA AND IS REQUIRED
      updatedCtx.elementPositionPx.delta.right = elSizePx('width') - discrepancyPx('left'); //right
      updatedCtx.elementPositionPct.discrepancy.right = elPositionPct('right') - defaultElSizePct('width'); //right
    }
    else if (x && backward('x')){
      updatedCtx.elementPositionPx.delta.left = elSizePx('width') - discrepancyPx('right'); //left
      updatedCtx.elementPositionPct.discrepancy.left = elPositionPct('left') - defaultElSizePct('width'); //left
    }
    if (y && !backward('y')){
      updatedCtx.elementPositionPx.delta.bottom = elSizePx('height') - discrepancyPx('top'); //bottom
      updatedCtx.elementPositionPct.discrepancy.bottom = elPositionPct('bottom') - defaultElSizePct('height'); //bottom
    }
    else if (y && backward('y')){
      updatedCtx.elementPositionPx.delta.top = elSizePx('height') - discrepancyPx('bottom'); //top
      updatedCtx.elementPositionPct.discrepancy.top = elPositionPct('top') - defaultElSizePct('height'); //top
    }

    this.ctx.set(updatedCtx);
  }

  ngAfterViewInit(){
    const el = this.hostElement.nativeElement;
    el.style.width = this.resizeConfig.elementSizePct.default.width + "%";
    el.style.height = this.resizeConfig.elementSizePct.default.height + "%";
    el.style.left = this.resizeConfig.elementPositionPct.default.left + "%";
    el.style.top = this.resizeConfig.elementPositionPct.default.top + "%";
  }
}
/*
   F. se encesita de para calcular relaciones, de forma natural debería ser el viewport, 
   la vision natural es que por default haya un dashboard renderizandose de fondo.
    
  
*/