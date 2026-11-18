(() => {
  const script = document.currentScript
  if (!script || document.getElementById('practice-sound')) return
  const root = new URL('./', script.src)
  const key = 'therapy-office:ambient'
  let saved = {}
  try { saved = JSON.parse(sessionStorage.getItem(key) || '{}') || {} } catch {}
  let wanted = saved.on === true
  let resumeAt = Number.isFinite(saved.time) && saved.time > 0 ? saved.time : 0
  let lastSave = 0

  const dock = document.createElement('div')
  dock.id = 'practice-sound'
  dock.innerHTML = '<button type="button" class="ambient-toggle" aria-label="Turn ambient sound on" aria-pressed="false"><svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><g class="wave"><path d="M15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12"/></g><g class="mute"><path d="m16 9 5 6m0-6-5 6"/></g></svg></button><span class="sound-status" role="status"></span>'
  const style = document.createElement('style')
  style.textContent = '#practice-sound{position:relative;margin-left:auto;width:max-content;font:14px/1.4 Arial,sans-serif}html[data-hide-sound] #practice-sound{visibility:hidden}.ambient-toggle{display:grid;place-items:center;width:42px;height:42px;padding:0;cursor:pointer;background:#f2ede2;color:#413c32;border:1px solid #b4a998;border-radius:50%;transition:background .25s,transform .25s}.ambient-toggle:hover{background:#e6ddcd;transform:translateY(-2px)}.ambient-toggle:focus-visible{outline:2px solid #554c3f;outline-offset:3px}.ambient-toggle .wave,.ambient-toggle[aria-pressed="true"] .mute{display:none}.ambient-toggle[aria-pressed="true"] .wave{display:block}.sound-status:not(:empty){position:absolute;bottom:48px;right:0;width:155px;background:#f3f0e7;color:#393630;padding:8px 12px;border:1px solid #b4a998}.sound-status:empty{display:none}@media(prefers-reduced-motion:reduce){.ambient-toggle{transition:none}}'
  document.head.append(style)
  const button = dock.querySelector('button')
  const status = dock.querySelector('[role="status"]')
  const audio = document.createElement('audio')
  audio.id = 'practice-ambient-track'
  audio.loop = true
  audio.preload = 'none'
  audio.volume = 0.24
  audio.src = new URL('media/ambient.mp3', root).href
  document.body.append(audio)
  function placeControl() {
    const slot = document.querySelector('[data-sound-slot]')
    if (slot && dock.parentNode !== slot) slot.append(dock)
  }
  placeControl()
  const app = document.getElementById('root')
  if (app) new MutationObserver(placeControl).observe(app, { subtree: true, childList: true })

  function save() {
    const time = audio.readyState ? audio.currentTime : resumeAt
    try { sessionStorage.setItem(key, JSON.stringify({ on: wanted, time })) } catch {}
  }
  function reflect() {
    const on = !audio.paused
    button.setAttribute('aria-pressed', String(on))
    button.setAttribute('aria-label', on ? 'Turn ambient sound off' : 'Turn ambient sound on')
  }
  function disarm() {
    document.removeEventListener('pointerdown', resume)
    document.removeEventListener('keydown', resume)
  }
  function resume(event) {
    if (!wanted || button.contains(event.target)) return
    disarm()
    void play(false)
  }
  async function play(manual) {
    status.textContent = ''
    try { await audio.play(); disarm() }
    catch {
      if (!wanted) return
      if (manual) status.textContent = 'Tap to try the sound again.'
      document.addEventListener('pointerdown', resume)
      document.addEventListener('keydown', resume)
    }
    reflect()
  }
  audio.addEventListener('loadedmetadata', () => {
    if (resumeAt && Number.isFinite(audio.duration)) audio.currentTime = resumeAt % audio.duration
    resumeAt = 0
  }, { once: true })
  audio.addEventListener('play', reflect)
  audio.addEventListener('pause', reflect)
  audio.addEventListener('timeupdate', () => {
    if (performance.now() - lastSave < 1500) return
    lastSave = performance.now()
    save()
  })
  button.addEventListener('click', () => {
    if (!audio.paused) {
      wanted = false
      disarm()
      audio.pause()
      status.textContent = ''
    } else {
      wanted = true
      void play(true)
    }
    save()
  })
  window.addEventListener('pagehide', save)
  if (wanted) void play(false)
})()
