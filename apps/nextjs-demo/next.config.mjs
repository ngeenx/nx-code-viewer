/**
 * Static-export (SSG) config. `output: 'export'` prerenders every route
 * to plain HTML in `out/` at `next build` time with no Node server at
 * runtime, which is the whole point of this showcase: proving the React
 * code viewer renders during the static pass and hydrates on load.
 *
 * The viewer ships as ESM with `react` as an external peer, so it is
 * transpiled by Next's build to dedupe React and process its bundled
 * runtime.
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  transpilePackages: ['@ngeenx/nx-react-code-viewer'],
  images: { unoptimized: true },
};

export default nextConfig;
