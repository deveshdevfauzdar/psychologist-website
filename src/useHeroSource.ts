import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

// Phones in portrait get a portrait crop of the video: same framing, far fewer bytes to load and decode.
const PHONE_PORTRAIT = '(max-width: 700px) and (orientation: portrait)'
const DESKTOP = { src: 'media/hero.mp4', poster: 'media/hero-poster.jpg' }
const PHONE = { src: 'media/hero-mobile.mp4', poster: 'media/hero-poster-mobile.jpg' }

export function useHeroSource(videoRef: RefObject<HTMLVideoElement | null>) {
  const [phone, setPhone] = useState(() => window.matchMedia(PHONE_PORTRAIT).matches)

  useEffect(() => {
    const query = window.matchMedia(PHONE_PORTRAIT)
    const change = () => {
      // Rotating the phone swaps files; carry on from the same moment instead of restarting.
      const video = videoRef.current
      if (video) {
        const time = video.currentTime
        const playing = !video.paused
        video.addEventListener('loadedmetadata', () => {
          video.currentTime = time
          if (playing) void video.play().catch(() => {})
        }, { once: true })
      }
      setPhone(query.matches)
    }
    query.addEventListener('change', change)
    return () => query.removeEventListener('change', change)
  }, [videoRef])

  return phone ? PHONE : DESKTOP
}
