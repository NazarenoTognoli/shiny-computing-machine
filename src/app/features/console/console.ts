import { Component } from '@angular/core';
import { WindowComponent } from '../window-system/window/window.component';
//services
import { WindowService } from '../window-system/window/window.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-console',
  imports: [WindowComponent],
  standalone: true,
  templateUrl: './console.html',
  styleUrl: './console.scss'
})
export class Console {
  windowService = inject(WindowService);
  onInput(event: Event) {
    const value = (event.target as HTMLTextAreaElement).value;
    //console.log(value);
  }
  onEnter(event: Event) {
    event.preventDefault();
    const textarea = event.target as HTMLTextAreaElement;
    const value = textarea.value;
    const arr = [...this.windowService.windows()];
    const wx = arr.findIndex(w => w.name === value);
    if (wx !== -1){
      arr[wx].active = true;
      this.windowService.windows.set(arr);
      this.windowService.bringToFront(value);
      this.windowService.ZIndexflag.set(this.windowService.ZIndexflag() + 1);
    } else {
      console.error("window not found");
      console.log(value);
    }
    textarea.value = '';
  }
}
