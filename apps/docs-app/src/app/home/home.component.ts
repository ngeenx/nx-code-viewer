import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	inject,
	signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
	CodeViewerComponent,
	DiffViewerComponent,
} from '@ngeenx/nx-angular-code-viewer';
import type {
	CodeViewerLanguage,
	CodeViewerTheme,
} from '@ngeenx/nx-code-viewer-utils';
import {
	LucideCode,
	LucideGitCompare,
	LucideMousePointerClick,
	LucidePalette,
	LucidePanelsTopLeft,
	LucideSlidersHorizontal,
	LucideSparkle,
	LucideSpotlight,
} from '@lucide/angular';

type FeatureCard = {
	image: string;
	icon: string;
	title: string;
	description: string;
	/** Short label shown in the card footer beside the action button. */
	meta: string;
	/**
	 * Internal route the card links to. Each feature points at the
	 * doc page or example that demonstrates it.
	 */
	href: string;
};

type FrameworkRow = {
	framework: string;
	pkg: string;
	status: 'stable' | 'stable+';
	bundle: string;
};

type Example = {
	framework: string;
	filename: string;
	language: CodeViewerLanguage;
	code: string;
	/**
	 * Same example reworked to use the diff viewer instead of the code
	 * viewer. The diff column on the right renders `oldCode` vs `newCode`
	 * so the only highlighted hunks are the import swap and the
	 * component-element swap (everything else is shared context).
	 */
	diffOld: string;
	diffNew: string;
};

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [
		RouterLink,
		CodeViewerComponent,
		DiffViewerComponent,
		LucideCode,
		LucideGitCompare,
		LucideMousePointerClick,
		LucidePalette,
		LucidePanelsTopLeft,
		LucideSlidersHorizontal,
		LucideSparkle,
		LucideSpotlight,
	],
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
	private readonly document = inject(DOCUMENT);

	/** Current year, rendered in the footer copyright line. */
	protected readonly year = new Date().getFullYear();

	/**
	 * Mirrors `<html>.dark` so the embedded `<nx-code-viewer>` instances
	 * flip themes alongside the viewer's light/dark toggle.
	 */
	readonly chromeTheme = signal<CodeViewerTheme>(
		this.document.documentElement.classList.contains('dark') ? 'dark' : 'light'
	);

	/**
	 * Rotates through the hero highlight: the first entry is the
	 * "anchor" word that the page starts on, the rest cycle in
	 * sequence.
	 */
	readonly heroWords = ['Angular', 'Vue', 'Svelte', 'React'] as const;
	private wordIndex = 0;
	readonly heroWord = signal<string>(this.heroWords[0]);
	readonly heroPrev = signal<string | null>(null);
	/**
	 * Flipped on every tick to retrigger the entering word's slide-in.
	 * The template binds it to an `.alt` class that swaps the entering
	 * element between two identical keyframes; changing the
	 * `animation-name` restarts the animation without recreating the DOM
	 * node (which would trip NG0956).
	 */
	readonly heroAnim = signal(false);
	private readonly leaveDurationMs = 380;
	private readonly enterDurationMs = 460;

	/**
	 * Framework icon URLs sourced from `crylith.config.ts` (the
	 * `framework` sidebar select). Keyed by the cycling word so the
	 * hero highlight and the chip row can both render an icon when
	 * one exists. `Native` intentionally has no icon.
	 */
	readonly frameworkIcons: Readonly<Record<string, string>> = {
		Angular:
			'https://angular.dev/assets/images/press-kit/angular_icon_gradient.gif',
		Vue: 'https://cdn.simpleicons.org/vuedotjs',
		Svelte: 'https://cdn.simpleicons.org/svelte',
		React: 'https://cdn.simpleicons.org/react',
	};

	iconFor(label: string): string | undefined {
		return this.frameworkIcons[label.replace(/\s.*$/, '')];
	}

	constructor() {
		const observer = new MutationObserver(() => {
			this.chromeTheme.set(
				this.document.documentElement.classList.contains('dark')
					? 'dark'
					: 'light'
			);
		});
		observer.observe(this.document.documentElement, {
			attributes: true,
			attributeFilter: ['class'],
		});

		let clearPrevId: ReturnType<typeof setTimeout> | undefined;
		const cycleId = setInterval(() => {
			this.heroPrev.set(this.heroWord());
			this.wordIndex = (this.wordIndex + 1) % this.heroWords.length;
			this.heroWord.set(this.heroWords[this.wordIndex]);
			this.heroAnim.update(v => !v);
			clearTimeout(clearPrevId);
			clearPrevId = setTimeout(
				() => this.heroPrev.set(null),
				this.leaveDurationMs + this.enterDurationMs + 50
			);
		}, 2200);

		inject(DestroyRef).onDestroy(() => {
			observer.disconnect();
			clearInterval(cycleId);
			clearTimeout(clearPrevId);
		});
	}

	readonly features: FeatureCard[] = [
		{
			icon: 'code',
			title: 'Syntax highlighting',
			description: 'Powered by Shiki with 180+ languages and bundled themes.',
			meta: 'Languages',
			image: '/assets/previews/syntax-highlighting.webp',
			href: '/docs/v1/get-started/syntax-highlighting',
		},
		{
			icon: 'palette',
			title: 'Dark, light and dual themes',
			description:
				'Pair two Shiki themes and let the viewer flip them in lockstep.',
			meta: 'Theming',
			image: '/assets/previews/dark-light-and-dual-themes.webp',
			href: '/docs/v1/theming',
		},
		{
			icon: 'sliders-horizontal',
			title: 'Line numbers and word wrap',
			description: 'Toggle gutters and wrapping per instance, never globally.',
			meta: 'Config',
			image: '/assets/previews/line-numbers-and-word-wrap.webp',
			href: '/docs/v1/get-started/configuration',
		},
		{
			icon: 'sparkle',
			title: 'Copy button built in',
			description:
				'Accessible copy control with success state and ARIA labels.',
			meta: 'Basics',
			image: '/assets/previews/copy-button-build-in.webp',
			href: '/examples/basic-usage',
		},
		{
			icon: 'git-compare',
			title: 'Diff viewer',
			description: 'Unified or split layouts for code reviews and changelogs.',
			meta: 'Diff',
			image: '/assets/previews/diff-viewer.webp',
			href: '/examples/diff-viewer',
		},
		{
			icon: 'panels-top-left',
			title: 'Multi-tab and column views',
			description:
				'Compare files side by side or stack tabs on a single block.',
			meta: 'Layouts',
			image: '/assets/previews/multi-tab-and-column-views.webp',
			href: '/examples/multi-tab-viewer',
		},
		{
			icon: 'spotlight',
			title: 'Highlight, focus, collapse',
			description:
				'Spotlight ranges, fade the rest, or collapse noisy sections.',
			meta: 'Highlight',
			image: '/assets/previews/higlight-focus-collapse.webp',
			href: '/examples/line-highlighting',
		},
		{
			icon: 'mouse-pointer-click',
			title: 'Reference popovers',
			description:
				'Tippy-powered hovercards for symbols, lazy-loaded on demand.',
			meta: 'Interactive',
			image: '/assets/previews/reference-popovers.webp',
			href: '/examples/interactive-features',
		},
	];

	readonly frameworks: FrameworkRow[] = [
		{
			framework: 'Angular',
			pkg: '@ngeenx/nx-angular-code-viewer',
			status: 'stable',
			bundle: 'Standalone components, signals',
		},
		{
			framework: 'Vue',
			pkg: '@ngeenx/nx-vue-code-viewer',
			status: 'stable',
			bundle: 'Composition API, <script setup>',
		},
		{
			framework: 'Svelte',
			pkg: '@ngeenx/nx-svelte-code-viewer',
			status: 'stable',
			bundle: 'Svelte 5 runes, native props',
		},
		{
			framework: 'React',
			pkg: '@ngeenx/nx-react-code-viewer',
			status: 'stable',
			bundle: 'Function components, hooks',
		},
	];

	readonly examples: Example[] = [
		{
			framework: 'Angular',
			filename: 'Angular Code Viewer Snippet',
			language: 'typescript',
			code: `import { Component, signal } from '@angular/core';
import { CodeViewerComponent } from '@ngeenx/nx-angular-code-viewer';

@Component({
  selector: 'app-snippet',
  imports: [CodeViewerComponent],
  template: \`
    <nx-code-viewer
      [code]="source()"
      language="typescript"
      shikiTheme="github-dark"
      [showLineNumbers]="true" />
  \`,
})
export class SnippetComponent {
  readonly source = signal(\`console.log('hello world');\`);
}`,
			diffOld: `import { Component, signal } from '@angular/core';
import { CodeViewerComponent } from '@ngeenx/nx-angular-code-viewer';

@Component({
  selector: 'app-snippet',
  imports: [CodeViewerComponent],
  template: \`
    <nx-code-viewer
      [code]="source()"
      language="typescript"
      shikiTheme="github-dark" />
  \`,
})
export class SnippetComponent {}`,
			diffNew: `import { Component, signal } from '@angular/core';
import { DiffViewerComponent } from '@ngeenx/nx-angular-code-viewer';

@Component({
  selector: 'app-snippet',
  imports: [DiffViewerComponent],
  template: \`
    <nx-diff-viewer
      [oldCode]="before()"
      [newCode]="after()"
      language="typescript"
      shikiTheme="github-dark" />
  \`,
})
export class SnippetComponent {}`,
		},
		{
			framework: 'Vue',
			filename: 'Snippet.vue',
			language: 'vue',
			code: `<template>
  <NxCodeViewer
    :code="source"
    language="typescript"
    shiki-theme="github-dark"
    :show-line-numbers="true" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { NxCodeViewer } from '@ngeenx/nx-vue-code-viewer';

const source = ref(\`console.log('hello world');\`);
</script>`,
			diffOld: `<template>
  <NxCodeViewer
    :code="source"
    language="typescript"
    shiki-theme="github-dark" />
</template>

<script setup lang="ts">
import { NxCodeViewer } from '@ngeenx/nx-vue-code-viewer';
</script>`,
			diffNew: `<template>
  <NxDiffViewer
    :old-code="before"
    :new-code="after"
    language="typescript"
    shiki-theme="github-dark" />
</template>

<script setup lang="ts">
import { NxDiffViewer } from '@ngeenx/nx-vue-code-viewer';
</script>`,
		},
		{
			framework: 'Svelte',
			filename: 'Snippet.svelte',
			language: 'svelte',
			code: `<NxCodeViewer
  code={source}
  language="typescript"
  shikiTheme="github-dark"
  showLineNumbers />

<script lang="ts">
  import { NxCodeViewer } from '@ngeenx/nx-svelte-code-viewer';

  let source = $state(\`console.log('hello world');\`);
</script>`,
			diffOld: `<NxCodeViewer
  code={source}
  language="typescript"
  shikiTheme="github-dark" />
  
  <script lang="ts">
  import { NxCodeViewer } from '@ngeenx/nx-svelte-code-viewer';
</script>`,
			diffNew: `
<NxDiffViewer
  oldCode={before}
  newCode={after}
  language="typescript"
  shikiTheme="github-dark" />
  
  <script lang="ts">
  import { NxDiffViewer } from '@ngeenx/nx-svelte-code-viewer';
</script>`,
		},
		{
			framework: 'React',
			filename: 'Snippet.tsx',
			language: 'tsx',
			code: `import { useState } from 'react';
import { NxCodeViewer } from '@ngeenx/nx-react-code-viewer';

export function Snippet() {
  const [source] = useState(\`console.log('hello world');\`);

  return (
    <NxCodeViewer
      code={source}
      language="typescript"
      shikiTheme="github-dark"
      showLineNumbers
    />
  );
}`,
			diffOld: `import { NxCodeViewer } from '@ngeenx/nx-react-code-viewer';

export function Snippet() {
  return (
    <NxCodeViewer
      code={source}
      language="typescript"
      shikiTheme="github-dark"
    />
  );
}`,
			diffNew: `import { NxDiffViewer } from '@ngeenx/nx-react-code-viewer';

export function Snippet() {
  return (
    <NxDiffViewer
      oldCode={before}
      newCode={after}
      language="typescript"
      shikiTheme="github-dark"
    />
  );
}`,
		},
	];

	readonly selectedExample = signal<Example>(this.examples[0]);

	selectExample(example: Example): void {
		this.selectedExample.set(example);
	}
}
