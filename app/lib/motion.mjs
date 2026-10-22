let pending = null

export function loadMotion() {
  pending ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
    ([gsapModule, triggerModule]) => {
      const gsap = gsapModule.default
      const { ScrollTrigger } = triggerModule
      gsap.registerPlugin(ScrollTrigger)
      return { gsap, ScrollTrigger }
    },
  )
  return pending
}

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
