import { useState, useEffect } from 'react'

interface UseTypingAnimationOptions {
  texts: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseTime?: number
  repeat?: boolean
}

export const useTypingAnimation = ({
  texts,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseTime = 2000,
  repeat = true,
}: UseTypingAnimationOptions) => {
  const [displayText, setDisplayText] = useState('')
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false)
        setIsDeleting(true)
      }, pauseTime)
      return () => clearTimeout(pauseTimer)
    }

    const currentText = texts[currentTextIndex]
    const speed = isDeleting ? deletingSpeed : typingSpeed

    const timer = setTimeout(() => {
      if (isDeleting) {
        if (displayText.length > 0) {
          setDisplayText(currentText.substring(0, displayText.length - 1))
        } else {
          setIsDeleting(false)
          if (currentTextIndex < texts.length - 1) {
            setCurrentTextIndex(currentTextIndex + 1)
          } else if (repeat) {
            setCurrentTextIndex(0)
          }
        }
      } else {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.substring(0, displayText.length + 1))
        } else {
          setIsPaused(true)
        }
      }
    }, speed)

    return () => clearTimeout(timer)
  }, [displayText, currentTextIndex, isDeleting, isPaused, texts, typingSpeed, deletingSpeed, pauseTime, repeat])

  return displayText
}
