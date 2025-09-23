import { Component, HostBinding, HostListener, ElementRef, Host, AfterViewInit, signal, computed, input, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
//Components
import { ResizeComponent } from './resize/resize.component';
import { RepositionComponent } from './reposition/reposition.component';
//UTILS 
import { toPixels, toPercentage } from '@shared/utils/units-conversion';
//Types
import { OnMouseDownOutput, OnMouseMoveOutput, OnMouseUpOutput, ResizeConfig, PositionProperties } from './resize/resize.component';
import { RepositionProperties } from './reposition/reposition.component';
//services
import { WindowService } from './window.service';

export interface Ctx {
  elementPositionPct: {
    discrepancy: RepositionProperties,
    default: RepositionProperties,
  };
  elementPositionPx: {
    delta: RepositionProperties,
  };
  elementSizePct: {
    default: {
      width: number,
      height: number,
    },
  };
  //container: {width?: number, height?: number};
}

@Component({
  selector: 'app-window',
  standalone: true,
  imports: [ResizeComponent, RepositionComponent, CommonModule],
  templateUrl: './window.component.html',
  styleUrl: './window.component.scss'
})
export class WindowComponent {
  constructor(@Host() public hostElement: ElementRef, public windowService:WindowService){
    effect(()=>{
      this.windowName() !== 'window' ? this.windowService.addWindow(this.windowName()) : null;
    });
    effect(()=>{
      (()=>this.windowService.ZIndexflag())(); //to trigger the effect when flag changes
      this.zindex.set(this.windowService.getZIndex(this.windowName()));
      //here i need to calculate maxzindex
      if (this.windowService.getZIndex(this.windowName()) === this.windowService.maxZindex()){
        this.hostFocus.set(true);
      } else {
        this.hostFocus.set(false);
      }
    });
    // effect(()=>{
    //   (()=>this.windowService.panelFlag())(); //to trigger the effect when flag changes
    //   this.containerWidth.set(this.container.width);
    //   this.containerHeight.set(this.container.height);
    // });
  }
  containerWidth = computed(() => this.windowService.container().width);
  containerHeight = computed(() => this.windowService.container().height);
  windowName = input<string>('window');
  //0 left 1 top 2 width 3 height
  windowDefault = input<[number, number, number, number]>([25, 25, 50, 50]);
  windowDefaultComputedPosition = computed(()=>{
    if (this.windowDefault()[0] + this.windowDefault()[2] > 100){
      console.error('The sum of left and width cannot be more than 100%.');
    }
    if (this.windowDefault()[1] + this.windowDefault()[3] > 100){
      console.error('The sum of top and height cannot be more than 100%.');
    }
    return { 
        left: this.windowDefault()[0],
        top: this.windowDefault()[1], 
        right: 100 - this.windowDefault()[2] - this.windowDefault()[0],
        bottom: 100 - this.windowDefault()[3] - this.windowDefault()[1],
      }
  });

  @HostBinding('style')
  get hostStyles() {
    return {
      'z-index':this.zindex(),
      // 'display': !this.windowService.findWindow(this.windowName()).active ? 'none' : 'flex',
    }
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event:MouseEvent){
    this.windowService.bringToFront(this.windowName());
    this.windowService.ZIndexflag.set(this.windowService.ZIndexflag() + 1);
  }

  handleCloseOnClickOutput(event:MouseEvent){
    this.windowService.removeWindow(this.windowName());
    this.windowService.ZIndexflag.set(this.windowService.ZIndexflag() + 1);
    const windowsCopy = [...this.windowService.windows()];
    const wx = windowsCopy.findIndex(w => w.name === this.windowName());
    windowsCopy[wx].active = false;
    this.windowService.windows.set(windowsCopy);
  }

  ctx = signal<Ctx>({
    elementPositionPct: {
      discrepancy: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
      default: this.windowDefaultComputedPosition(),
    },
    elementPositionPx: {
      delta: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      } 
    },
    elementSizePct: {
      default: {
        width: this.windowDefault()[2],
        height: this.windowDefault()[3],
      }
    }
  });

  hostFocus = signal<boolean>(false);
  zindex = signal<number>(1);

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
  }

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

  repositionInput = computed(()=>({
    left: toPixels(this.ctx().elementPositionPct.default.left, this.containerWidth()),
    top: toPixels(this.ctx().elementPositionPct.default.top, this.containerHeight()),
    right: toPixels(this.ctx().elementPositionPct.default.right, this.containerWidth()),
    bottom: toPixels(this.ctx().elementPositionPct.default.bottom, this.containerHeight()),
  }));

  handleRepositionOutput({left, top, right, bottom}:RepositionProperties){
    const updatedCtx = {...this.ctx()};
    
    updatedCtx.elementPositionPct.default = {
      left: toPercentage(left, this.containerWidth()),
      top: toPercentage(top, this.containerHeight()),
      right: toPercentage(right, this.containerWidth()),
      bottom: toPercentage(bottom, this.containerHeight()),
    }

    this.ctx.set(updatedCtx);

    const discrepancyPct = (a:PositionProperties) => this.ctx().elementPositionPct.discrepancy[a];
    const defaultPositionPct = (a:PositionProperties) => this.ctx().elementPositionPct.default[a];
    
    const el = this.hostElement.nativeElement;
    
    el.style.removeProperty('right');
    el.style.removeProperty('bottom');
    el.style.left = `calc(${defaultPositionPct('left') - discrepancyPct('left')}%)`;
    el.style.top = `calc(${defaultPositionPct('top') - discrepancyPct('top')}%)`;
  }

  handleResizeOnMouseDownOutput({positionToRemove, positionToApply}:OnMouseDownOutput){
    const discrepancyPct = this.ctx().elementPositionPct.discrepancy[positionToApply];
    const defaultPositionPct = this.ctx().elementPositionPct.default[positionToApply];
    const el = this.hostElement.nativeElement;
    el.style.removeProperty(positionToRemove);
    el.style[positionToApply] = `calc(${defaultPositionPct - discrepancyPct}%)`;
  }

  handleResizeOnMouseMoveOutput({width, height}:OnMouseMoveOutput){
    const el = this.hostElement.nativeElement;
    if (width !== null){
      el.style.width = `${toPercentage(width, this.containerWidth())}%`;
    }
    if (height !== null){
      el.style.height = `${toPercentage(height, this.containerHeight())}%`;
    }
  }

  handleResizeOnMouseUpOutput({ x, y, backward }: OnMouseUpOutput) {
    const ctx = this.ctx();
    const updatedCtx: Ctx = { ...ctx };

    const container = (a: 'width' | 'height' | PositionProperties) => {
      //const rawContainer = this.ctx().container;
      const containerX = this.containerWidth();
      const containerY = this.containerHeight();
      return a === 'width' || a === 'left' || a === 'right' ? containerX : containerY;   
    }
    
    const elementSizePx = (a: 'width' | 'height') => this.resizeConfig.elementSizePx.current[a]();
    const defaultElementSizePct = (a: 'width' | 'height') => updatedCtx.elementSizePct.default[a];

    const discrepancyPx = (a: PositionProperties) => toPixels(updatedCtx.elementPositionPct.discrepancy[a], container(a));
    const elementDeltaPct = (a: PositionProperties) => toPercentage(updatedCtx.elementPositionPx.delta[a], container(a));
     
    if (x && !backward('x')){
      updatedCtx.elementPositionPx.delta.right = elementSizePx('width') - discrepancyPx('left'); //right
      updatedCtx.elementPositionPct.discrepancy.right = elementDeltaPct('right') - defaultElementSizePct('width'); //right
    }
    else if (x && backward('x')){
      updatedCtx.elementPositionPx.delta.left = elementSizePx('width') - discrepancyPx('right'); //left
      updatedCtx.elementPositionPct.discrepancy.left = elementDeltaPct('left') - defaultElementSizePct('width'); //left
    }
    if (y && !backward('y')){
      updatedCtx.elementPositionPx.delta.bottom = elementSizePx('height') - discrepancyPx('top'); //bottom
      updatedCtx.elementPositionPct.discrepancy.bottom = elementDeltaPct('bottom') - defaultElementSizePct('height'); //bottom
    }
    else if (y && backward('y')){
      updatedCtx.elementPositionPx.delta.top = elementSizePx('height') - discrepancyPx('bottom'); //top
      updatedCtx.elementPositionPct.discrepancy.top = elementDeltaPct('top') - defaultElementSizePct('height'); //top
    }

    this.ctx.set(updatedCtx);
  }

  // @HostListener('window:resize', ['$event'])
  // onResize(event: UIEvent) {
  //   this.containerWidth.set(this.containerWidth());
  //   this.containerHeight.set(this.container.height);
  // }

  ngOnInit(){
    //for initialization of ctx signal with input values
    const ctxCopy = {...this.ctx()};
    ctxCopy.elementSizePct.default.width = this.windowDefault()[2];
    ctxCopy.elementSizePct.default.height = this.windowDefault()[3];
    ctxCopy.elementPositionPct.default = this.windowDefaultComputedPosition();
    this.ctx.set(ctxCopy);
  }
  
  ngAfterViewInit(){
    const el = this.hostElement.nativeElement;
    el.style.width = this.ctx().elementSizePct.default.width + "%";
    el.style.height = this.ctx().elementSizePct.default.height + "%";
    el.style.left = this.ctx().elementPositionPct.default.left + "%";
    el.style.top = this.ctx().elementPositionPct.default.top + "%";
    this.windowService.ZIndexflag.set(this.windowService.ZIndexflag() + 1);
  }
}