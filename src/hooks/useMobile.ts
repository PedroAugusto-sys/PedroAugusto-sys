import { useState, useEffect, useRef } from 'react'

export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile((prev) => {
        if (prev !== mobile) {
          return mobile
        }
        return prev
      })
    }

    checkMobile()

    const handleResize = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(checkMobile, 150)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return isMobile
}
