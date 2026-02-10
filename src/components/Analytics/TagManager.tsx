import { useEffect } from 'react'

declare global {
  interface Window {
    dataLayer: any[]
  }
}

const GTM_ID = import.meta.env.VITE_GTM_ID || ''

const TagManager = () => {
  useEffect(() => {
    if (!GTM_ID) {
      return
    }

    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js',
    })

    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`
    document.head.appendChild(script)

    const noscript = document.createElement('noscript')
    const iframe = document.createElement('iframe')
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${GTM_ID}`
    iframe.height = '0'
    iframe.width = '0'
    iframe.style.display = 'none'
    iframe.style.visibility = 'hidden'
    noscript.appendChild(iframe)
    document.body.appendChild(noscript)

    return () => {
    }
  }, [])

  return null
}

export default TagManager
