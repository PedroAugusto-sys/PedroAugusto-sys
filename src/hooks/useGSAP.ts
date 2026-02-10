import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

ScrollTrigger.config({
  autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
  ignoreMobileResize: true,
})

export const useGSAP = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationsRef = useRef<Map<gsap.TweenTarget, gsap.core.Tween>>(new Map())
  const scrollTriggersRef = useRef<ScrollTrigger[]>([])

  const animateIn = (
    element: gsap.TweenTarget,
    options?: gsap.TweenVars
  ) => {
    if (animationsRef.current.has(element)) {
      return animationsRef.current.get(element)!
    }

    const scrollTriggerConfig: ScrollTrigger.Vars = {
      trigger: element as gsap.DOMTarget,
      start: 'top 90%',
      toggleActions: 'play none none none',
      once: true,
      invalidateOnRefresh: false,
    }

    const animation = gsap.from(element, {
      opacity: 0,
      y: 50,
      duration: 0.5,
      ease: 'power3.out',
      immediateRender: false,
      onComplete: () => {
        gsap.set(element, { opacity: 1, y: 0 })
      },
      scrollTrigger: scrollTriggerConfig,
      ...options,
    })

    animationsRef.current.set(element, animation)
    if (animation.scrollTrigger) {
      scrollTriggersRef.current.push(animation.scrollTrigger)
    }

    return animation
  }

  const animateOnScroll = (
    element: gsap.TweenTarget,
    animation: gsap.TweenVars,
    scrollOptions?: ScrollTrigger.Vars
  ) => {
    if (animationsRef.current.has(element)) {
      return animationsRef.current.get(element)!
    }

    const scrollTriggerConfig: ScrollTrigger.Vars = {
      trigger: element as gsap.DOMTarget,
      start: 'top 90%',
      toggleActions: 'play none none none',
      once: true,
      invalidateOnRefresh: false,
      ...scrollOptions,
    }

    const tween = gsap.to(element, {
      ...animation,
      immediateRender: false,
      onComplete: () => {
        if (typeof animation.opacity === 'number') {
          gsap.set(element, { opacity: animation.opacity })
        }
      },
      scrollTrigger: scrollTriggerConfig,
    })

    animationsRef.current.set(element, tween)
    if (tween.scrollTrigger) {
      scrollTriggersRef.current.push(tween.scrollTrigger)
    }

    return tween
  }

  useEffect(() => {
    ScrollTrigger.refresh()
    
    let refreshTimeout: ReturnType<typeof setTimeout> | null = null
    const handleResize = () => {
      if (refreshTimeout) {
        clearTimeout(refreshTimeout)
      }
      refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh()
      }, 200)
    }

    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      window.removeEventListener('resize', handleResize)
      if (refreshTimeout) {
        clearTimeout(refreshTimeout)
      }
      
      scrollTriggersRef.current.forEach((trigger) => {
        if (trigger && trigger.isActive !== false) {
          trigger.kill()
        }
      })
      scrollTriggersRef.current = []
      
      animationsRef.current.forEach((animation) => {
        if (animation && animation.scrollTrigger) {
          animation.scrollTrigger.kill()
        }
        animation.kill()
      })
      animationsRef.current.clear()
    }
  }, [])

  return {
    containerRef,
    animateIn,
    animateOnScroll,
    gsap,
    ScrollTrigger,
  }
}
