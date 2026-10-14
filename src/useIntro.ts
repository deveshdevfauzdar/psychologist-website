import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

// loading → the strip grows with real progress, then settles at 100%;
// revealing → after a short hold (--intro-hold in index.css) the strip opens and the video spins in;
// complete → the page is interactive.
export type IntroPhase = 'loading' | 'revealing' | 'complete'

const MIN_LOADING_MS = 2100
const MAX_LOADING_MS = 6000
// The reveal's CSS animations are all created the moment 'revealing' starts and wait out --intro-hold.
// Setting them up costs the browser a few frames, so it happens while the full strip is standing still.
const BAR_SETTLE_MS = 220
const REVEAL_MS = 1700

// Adapted from the expanding strip / video reveal in Reference/Loading.zip.
export function useIntro(videoRef: RefObject<HTMLVideoElement | null>, reducedMotion: boolean | null) {
  const [phase, setPhase] = useState<IntroPhase>(reducedMotion ? 'complete' : 'loading')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (reducedMotion) { setPhase('complete'); setProgress(100); return }
    if (phase !== 'loading') return
    const started = performance.now()
    let fontsReady = false
    let disposed = false
    let settle = 0
    void document.fonts.ready.then(() => { if (!disposed) fontsReady = true })
    const timer = window.setInterval(() => {
      const elapsed = performance.now() - started
      // The video plays hidden while loading, so wait until frames are actually flowing.
      const videoReady = (videoRef.current?.readyState ?? 0) >= 3
      const timeProgress = Math.min(elapsed / MIN_LOADING_MS, 1)
      setProgress(Math.min(94, Math.floor(timeProgress * 76 + (fontsReady ? 9 : 0) + (videoReady ? 9 : 0))))
      // Always continue with the poster if media is unavailable or slow.
      if ((elapsed >= MIN_LOADING_MS && fontsReady && videoReady) || elapsed >= MAX_LOADING_MS) {
        window.clearInterval(timer)
        setProgress(100)
        settle = window.setTimeout(() => setPhase('revealing'), BAR_SETTLE_MS)
      }
    }, 40)
    return () => { disposed = true; window.clearInterval(timer); window.clearTimeout(settle) }
  }, [phase, reducedMotion, videoRef])

  useEffect(() => {
    if (phase !== 'revealing') return
    const timer = window.setTimeout(() => setPhase('complete'), REVEAL_MS)
    return () => window.clearTimeout(timer)
  }, [phase])

  return { phase, progress, skip: () => { setProgress(100); setPhase('revealing') } }
}
