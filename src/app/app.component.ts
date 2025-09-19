import { Component, signal, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Debugger } from './features/debugger/debugger';
import { Nav } from './features/nav/nav';
import { Card } from './features/card/card';
import { Panel } from '@features/window-system/panel/panel';
//services
import { WindowService } from './features/window-system/window/window.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule , Debugger, Nav, Card, Panel],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit, OnDestroy {
  title = 'purgatory-ui';
  isPanelExpanded = signal(false);
  handleIsPanelExpandedChange(isExpanded: boolean) {
    this.isPanelExpanded.set(isExpanded);
    Promise.resolve().then(() => {
      this.updateContainer();
    });
  }
  constructor(private windowService: WindowService) {}
  @ViewChild('dashboard', { static: true }) elementRef!: ElementRef;
  getCurrentDashboard = () => this.elementRef.nativeElement.getBoundingClientRect();

  updateContainer = () => {
    const rect = this.getCurrentDashboard();
    this.windowService.container.set({ width: rect.width, height: rect.height });
    console.log(this.windowService.container());
  }

  ngAfterViewInit() {
    this.updateContainer();
    window.addEventListener('resize', this.updateContainer);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.updateContainer);
  }
}
