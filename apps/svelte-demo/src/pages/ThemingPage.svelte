<script lang="ts">
  import { CodeViewer } from '@ngeenx/nx-svelte-code-viewer';
  import { useTheme } from '../stores/theme.svelte';

  const { theme, getResolvedShikiTheme } = useTheme();

  interface ThemeExample {
    name: string;
    cssClass: string;
    description: string;
  }

  const themes: ThemeExample[] = [
    { name: 'Cyberpunk', cssClass: 'theme-cyberpunk', description: 'A neon-inspired theme with cyan/magenta accents' },
    { name: 'Minimal', cssClass: 'theme-minimal', description: 'A clean, subtle theme with reduced visual noise' },
    { name: 'High Contrast', cssClass: 'theme-high-contrast', description: 'Enhanced visibility with bolder colors' },
    { name: 'GitHub', cssClass: 'theme-github', description: "Inspired by GitHub's code viewing interface" },
    { name: 'Dracula', cssClass: 'theme-dracula', description: 'A dark theme with vibrant purple and pink accents' },
    { name: 'Handwritten', cssClass: 'theme-handwritten', description: 'A playful theme with the Delius Swash Caps handwritten font' },
  ];

  const codeExample = `interface User {
  id: number;
  name: string;
  email: string;
}

function greetUser(user: User): string {
  return \`Hello, \${user.name}!\`;
}

const user: User = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
};

console.log(greetUser(user));`;
</script>

<div class="page-container {theme}">
  <div class="page-header">
    <h1 class="page-title">Custom Theming</h1>
    <p class="page-description">
      Apply custom CSS themes to the code viewer to match your application's design.
    </p>
  </div>

  {#each themes as themeExample}
    <section class="demo-section">
      <h2 class="demo-section-title">{themeExample.name}</h2>
      <p class="demo-section-description">{themeExample.description}</p>

      <div class={themeExample.cssClass}>
        <CodeViewer
          code={codeExample}
          language="typescript"
          {theme}
          shikiTheme={getResolvedShikiTheme()}
          showHeader={true}
          title="{themeExample.cssClass}.ts"
          fileExtension=".ts"
          showLineNumbers={true}
        />
      </div>
    </section>
  {/each}
</div>
