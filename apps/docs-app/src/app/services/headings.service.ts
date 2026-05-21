import { Injectable, signal } from '@angular/core';
import { TocItem } from '@crylith/shell-angular';

@Injectable({ providedIn: 'root' })
export class HeadingsService {
  private headingsSignal = signal<TocItem[]>([]);

  readonly headings = this.headingsSignal.asReadonly();

  setHeadings(headings: TocItem[]): void {
    this.headingsSignal.set(headings);
  }

  clearHeadings(): void {
    this.headingsSignal.set([]);
  }
}
