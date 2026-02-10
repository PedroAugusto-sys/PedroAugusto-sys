declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }

  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: action,
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

export const trackPageView = (path: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', import.meta.env.VITE_GA4_ID || '', {
      page_path: path,
    })
  }
}

export const track3DInteraction = (interactionType: string, objectName?: string) => {
  trackEvent('3d_interaction', 'threejs', `${interactionType}_${objectName || 'unknown'}`)
}

export const trackSectionView = (sectionName: string) => {
  trackEvent('section_view', 'navigation', sectionName)
}

export const trackProjectClick = (projectName: string) => {
  trackEvent('project_click', 'projects', projectName)
}
