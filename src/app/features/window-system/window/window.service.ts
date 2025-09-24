import { Injectable, signal } from '@angular/core';
interface Window {
  name: string;
  active: boolean;
  zIndex: number;
}
@Injectable({
  providedIn: 'root'
})
export class WindowService {
  ZIndexflag = signal<number>(0);
  panelFlag = signal<boolean>(false);
  windows = signal<Window[]>([]);
  container = signal<{width: number, height: number}>({width: window.innerWidth, height: window.innerHeight});
  constructor() {}

  // Add a new id to the top (highest z-index)
  addWindow(id: string) {
    if (!this.windows().some(w => w.name === id)) {
      const newWindows = [...this.windows(), {name: id, active:false, zIndex:this.maxZindex() + 10}]; // create a new array
      this.windows.set(newWindows);
    }
  }

  // Remove an existing id from the list
  removeWindow(name: string): void {
    const newWindows = [...this.windows()];
    const wx = newWindows.findIndex(w => w.name === name);
    if (wx !== -1) {
      newWindows[wx].active = false;
      this.windows.set(newWindows);           // actualiza el signal
      console.log('removed window:', name, this.windows(), newWindows);
    }
  }

  bringToFront(name: string) {
    const windows = this.windows();
    const wx = windows.findIndex(w => w.name === name);

    if (wx !== -1) {
      const targetZ = windows[wx].zIndex;

      const newWindows = windows.map(w => {
        // Solo modificar si tiene menor zIndex que el objetivo
        if (w.zIndex >= targetZ) {
          return {
            name: w.name,
            zIndex: w.zIndex - 10,
            active: w.active
          };
        }
        return { ...w }; // mantener sin cambios
      });

      // Elevar el zIndex del objetivo al máximo
      newWindows[wx].zIndex = this.maxZindex(newWindows) + 10;

      this.windows.set(newWindows);
      //console.log('bring to front', this.windows());
    }
  }

  // Get the z-index for a given id
  getZIndex(name: string): number {
    const wx = this.windows().findIndex(w => w.name === name);
    return this.windows()[wx].zIndex; // z-index starts from 1
  }

  maxZindex(windows:Window[] = this.windows()): number {
    const zIndices = windows.map(w => w.zIndex);
    const max = zIndices.length ? Math.max(...zIndices) : 0;
    return max
  }

  findWindow(name:string):Window{
    const def = {name:'', zIndex:0, active:false};
    const find = this.windows().find(w => w.name === name);
    if (find) {
      return find
    }
    return def
  }
}
