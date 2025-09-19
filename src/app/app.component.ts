import { Component, signal, HostBinding, Host } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Debugger } from './features/debugger/debugger';
import { Nav } from './features/nav/nav';
import { Card } from './features/card/card';
import { Panel } from '@features/window-system/panel/panel';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule , Debugger, Nav, Card, Panel],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'purgatory-ui';
  isPanelExpanded = signal(false);
  handleIsPanelExpandedChange(isExpanded: boolean) {
    this.isPanelExpanded.set(isExpanded);
  }
}
