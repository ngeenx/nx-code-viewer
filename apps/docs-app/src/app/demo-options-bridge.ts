/**
 * Push a key/value bag of "demo options" (sidebar-select values like
 * `codeViewerTheme`, `shikiTheme`) into every live-demo iframe.
 *
 * The Crylith iframe bridge listens for `crylith:demo-options/v1`,
 * stashes the payload on `window.__crylithDemoOptions`, and dispatches
 * a `crylith:demo-options` `CustomEvent` so demo components can react.
 *
 * Two-way contract:
 *  - call `updateDemoOptions(values)` whenever the host's source-of-truth
 *    (sidebar selects, theme service, etc.) changes;
 *  - the bridge also listens for the iframe's `crylith:demo-ready`
 *    handshake and re-posts the latest values, covering iframes that
 *    mount after the first update.
 *
 * Walk every `<crylith-live-demo>` element on the page rather than
 * tracking iframes ourselves: the runtime already manages the lifecycle
 * of the inner `<iframe>` inside its shadow DOM, and re-querying on
 * each update is cheap (DOM count is the number of demo blocks on the
 * current route).
 */
const MESSAGE_TYPE = 'crylith:demo-options/v1'
const READY_MESSAGE_TYPE = 'crylith:demo-ready'

let latestValues: Record<string, string> = {}
let bridgeStarted = false

export function updateDemoOptions(values: Record<string, string>): void {
  latestValues = { ...values }
  postToAllIframes(latestValues)
}

export function startDemoOptionsBridge(): void {
  if (bridgeStarted) return
  bridgeStarted = true
  window.addEventListener('message', event => {
    const data = event.data as { type?: string } | null
    if (!data || data.type !== READY_MESSAGE_TYPE) return
    // The iframe that just became ready posted via window.parent.
    // Reply directly to it instead of broadcasting again.
    const source = event.source as Window | null
    if (!source) return
    try {
      source.postMessage({ type: MESSAGE_TYPE, values: latestValues }, '*')
    } catch {
      // cross-origin or detached iframe; best-effort
    }
  })
}

function postToAllIframes(values: Record<string, string>): void {
  const elements = document.querySelectorAll('crylith-live-demo')
  elements.forEach(el => {
    const iframe = el.shadowRoot?.querySelector('iframe')
    iframe?.contentWindow?.postMessage({ type: MESSAGE_TYPE, values }, '*')
  })
}
