import { Component, effect, signal, HostBinding, output } from '@angular/core';
import { CommonModule } from '@angular/common';
//services
import { WindowService } from '../../window-system/window/window.service';
@Component({
  selector: 'app-panel',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './panel.html',
  styleUrl: './panel.scss'
})
export class Panel {
  isPanelExpanded = signal(false);
  isPanelExpandedChange = output<boolean>();
  @HostBinding('style')
  get hostStyles() {
    return {
      'height': this.isPanelExpanded() ? '100vh' : '50px',
      'position': this.isPanelExpanded() ? 'relative' : 'absolute',
      'background-color': this.isPanelExpanded() ? '#222' : 'transparent',
      'border-color': this.isPanelExpanded() ? '#999' : 'transparent',
    }
  }
  constructor(windowService: WindowService) {
    effect(() => {
      if (this.isPanelExpanded()) {
        this.isPanelExpandedChange.emit(true);
      } else {
        this.isPanelExpandedChange.emit(false);
      }
    });
  }
}
