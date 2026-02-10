import { useCallback, useRef } from 'react'
import gsap from 'gsap'

export const useSmoothScroll = () => {
  const scrollAnimationRef = useRef<gsap.core.Tween | null>(null)

  const scrollTo = useCallback((target: string | HTMLElement, options?: { duration?: number; offset?: number }) => {
    const element = typeof target === 'string' 
      ? document.getElementById(target) || document.querySelector(target)
      : target

    if (!element) {
      console.warn(`Element not found: ${target}`)
      return
    }

    if (scrollAnimationRef.current) {
      scrollAnimationRef.current.kill()
    }

    const duration = options?.duration ?? 1.2
    const offset = options?.offset ?? 0
    const startPosition = window.pageYOffset
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
    const finalPosition = elementPosition + offset
    const scrollObj = { y: startPosition }
    
    scrollAnimationRef.current = gsap.to(scrollObj, {
      y: finalPosition,
      duration,
      ease: 'power2.inOut',
      onUpdate: () => {
        window.scrollTo(0, scrollObj.y)
      },
      onComplete: () => {
        scrollAnimationRef.current = null
      },
    })
  }, [])

  const scrollToTop = useCallback((options?: { duration?: number }) => {
    if (scrollAnimationRef.current) {
      scrollAnimationRef.current.kill()
    }

    const duration = options?.duration ?? 1.0
    const startPosition = window.pageYOffset
    const scrollObj = { y: startPosition }
    
    scrollAnimationRef.current = gsap.to(scrollObj, {
      y: 0,
      duration,
      ease: 'power2.inOut',
      onUpdate: () => {
        window.scrollTo(0, scrollObj.y)
      },
      onComplete: () => {
        scrollAnimationRef.current = null
      },
    })
  }, [])

  return {
    scrollTo,
    scrollToTop,
  }
}
