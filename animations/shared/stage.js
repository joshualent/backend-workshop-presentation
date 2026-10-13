/*
 * Shared plumbing for the videos. Each video builds a paused GSAP timeline and
 * calls registerVideo(); render.mjs then seeks it frame by frame.
 *
 *   index.html            plays in a loop (preview in any browser)
 *   index.html?t=12.5     holds on 12.5 s (check a stop)
 *   index.html?render     waits for render.mjs to drive it
 */

/** Create an element: el('div', 'abs caption', { left: 60, top: 230 }, 'text'). */
window.el = function el(tag, cls, style = {}, text, parent = document.getElementById('stage')) {
  const node = document.createElement(tag)
  if (cls)
    node.className = cls
  for (const [k, v] of Object.entries(style))
    node.style[k] = typeof v === 'number' && !['opacity', 'zIndex', 'fontWeight'].includes(k) ? `${v}px` : v
  if (text != null)
    node.innerHTML = text
  parent.appendChild(node)
  return node
}

/** Escape text for innerHTML. */
window.esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

window.registerVideo = function registerVideo(tl, meta) {
  const duration = meta.duration
  tl.set({}, {}, duration) // pad the timeline to its full length
  window.__video = { fps: 30, ...meta }
  window.__seek = (t) => {
    tl.seek(Math.min(t, duration), false)
  }
  const params = new URLSearchParams(location.search)
  if (params.has('render'))
    return
  document.fonts.ready.then(() => {
    if (params.has('t')) {
      tl.seek(Number(params.get('t')), false)
    }
    else {
      tl.repeat(-1)
      tl.play(0)
    }
  })
}
