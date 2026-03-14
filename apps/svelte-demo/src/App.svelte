<script lang="ts">
  import { NxSvelteCodeViewer } from '@ngeenx/nx-svelte-code-viewer';

  const sampleCode = `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<h1>Hello World</h1>',
})
export class AppComponent {
  title = 'my-app';
}`;
</script>

<main>
  <h1>Welcome to svelte-demo</h1>

  <div style="max-width: 800px; margin: 2rem auto;">
    <NxSvelteCodeViewer
      code={sampleCode}
      language="typescript"
      theme="dark"
      title="example.ts"
      showLineNumbers={true}
      showCopyButton={true}
      showHeader={true}
    />
  </div>
</main>
