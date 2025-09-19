import { Injectable, signal } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class WindowService {
  flag = signal<number>(0);
  ids = signal<string[]>([]);

  constructor() {}

  // Add a new id to the top (highest z-index)
  addId(id: string) {
    if (!this.ids().includes(id)) {
      const newIds:string[] = this.ids();
      newIds.push(id);
      this.ids.set(newIds);
    }
  }

  // Remove an existing id from the list
  removeId(id: string): void {
    const currentIds = this.ids();
    const idx = currentIds.indexOf(id);

    if (idx !== -1) {
      const newIds = [...currentIds]; // copia defensiva
      newIds.splice(idx, 1);          // elimina el id
      this.ids.set(newIds);           // actualiza el signal
      console.log('removed id:', id, this.ids());
    }
  }

  // Bring an existing id to the top (highest z-index)
  bringToFront(id: string) {
    const idx = this.ids().indexOf(id);
    if (idx !== -1) {
      const newIds = this.ids();
      newIds.splice(idx, 1); // Remove from current position
      newIds.push(id);
      this.ids.set(newIds);       // Add to the end (top)
    }
    console.log('bring to front', id, this.ids());
  }

  // Get the z-index for a given id
  getZIndex(id: string): number {
    const idx = this.ids().indexOf(id);
    return idx === -1 ? 0 : idx + 1; // z-index starts from 1
  }
}
