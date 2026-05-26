import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  OnDestroy,
  output,
  viewChild,
} from '@angular/core';
import type * as MonacoNs from 'monaco-editor';

/**
 * Wide centered modal that renders the current theme variables as a
 * CSS snippet inside a Monaco editor. Monaco is dynamically imported
 * so its 1MB+ chunk only loads when the user actually opens the
 * dialog.
 */
@Component({
  selector: 'app-export-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './export-modal.component.html',
  styleUrl: './export-modal.component.css',
})
export class ExportModalComponent implements AfterViewInit, OnDestroy {
  private readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly content = input.required<string>();
  readonly themeMode = input<'light' | 'dark'>('light');
  readonly close = output<void>();

  private readonly editorHost =
    viewChild.required<ElementRef<HTMLDivElement>>('editorHost');

  private editor: MonacoNs.editor.IStandaloneCodeEditor | null = null;

  async ngAfterViewInit(): Promise<void> {
    const monaco = await import('monaco-editor');
    this.editor = monaco.editor.create(this.editorHost().nativeElement, {
      value: this.content(),
      language: 'css',
      theme: this.themeMode() === 'dark' ? 'vs-dark' : 'vs',
      readOnly: true,
      automaticLayout: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 13,
      lineNumbers: 'on',
      renderLineHighlight: 'none',
      smoothScrolling: true,
      padding: { top: 12, bottom: 12 },
    });
  }

  ngOnDestroy(): void {
    this.editor?.dispose();
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === this.hostRef.nativeElement.querySelector('.backdrop')) {
      this.close.emit();
    }
  }

  protected onCloseClick(): void {
    this.close.emit();
  }

  protected async copyToClipboard(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.content());
    } catch {
      // Clipboard API can fail in non-secure contexts; ignored
      // intentionally — the editor itself is selectable as fallback.
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.close.emit();
  }
}
