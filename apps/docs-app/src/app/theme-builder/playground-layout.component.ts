import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  NavbarDualComponent,
  NavbarMegaComponent,
  NavbarSimpleComponent,
  NavbarTabComponent,
  ShellHeaderComponent,
  ShellService,
} from '@crylith/shell-angular';

/**
 * Minimal Crylith chrome for non-documentation pages (playgrounds).
 *
 * Reuses `<crylith-shell-header>` + the navbar variant resolved from
 * the active layout preset, wrapped in the same `crylith-zone-layout`
 * container that `CrylithLayoutComponent` uses so the shared shell
 * styles (container width, navbar variant attribute, content offset)
 * apply identically. Drops sidebar, TOC, breadcrumbs, pagination,
 * right panel, and footer zones.
 */
@Component({
  selector: 'app-playground-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    ShellHeaderComponent,
    NavbarSimpleComponent,
    NavbarMegaComponent,
    NavbarDualComponent,
    NavbarTabComponent,
  ],
  templateUrl: './playground-layout.component.html',
  styleUrl: './playground-layout.component.css',
})
export class PlaygroundLayoutComponent {
  private readonly shell = inject(ShellService);

  protected readonly layout = computed(() => this.shell.activeLayout());
  protected readonly navbarData = this.shell.navbarData;
  protected readonly containerMaxWidth = computed<'1400px' | '100%'>(
    () => '1400px'
  );

  protected readonly totalNavbarHeight = computed(() => {
    const nav = this.layout().navbar;
    if (!nav.show) return '0px';
    const headerHeight = 56;
    const navHeight =
      nav.height + (nav.showSecondaryRow ? nav.secondaryHeight : 0);
    return `${headerHeight + navHeight}px`;
  });
}
