export const updateMetaTags = (data: {
  title?: string
  description?: string
  image?: string
  url?: string
}) => {
  if (data.title) {
    document.title = data.title
    updateMetaTag('og:title', data.title)
    updateMetaTag('twitter:title', data.title)
  }

  if (data.description) {
    updateMetaTag('description', data.description)
    updateMetaTag('og:description', data.description)
    updateMetaTag('twitter:description', data.description)
  }

  if (data.image) {
    updateMetaTag('og:image', data.image)
    updateMetaTag('twitter:image', data.image)
  }

  if (data.url) {
    updateMetaTag('og:url', data.url)
    updateMetaTag('twitter:url', data.url)
  }
}

const updateMetaTag = (property: string, content: string) => {
  let element = document.querySelector(`meta[property="${property}"]`) ||
                document.querySelector(`meta[name="${property}"]`)

  if (!element) {
    element = document.createElement('meta')
    if (property.startsWith('og:') || property.startsWith('twitter:')) {
      element.setAttribute('property', property)
    } else {
      element.setAttribute('name', property)
    }
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

export const generateStructuredData = (data: {
  name: string
  description: string
  url: string
  image?: string
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: data.name,
    description: data.description,
    url: data.url,
    image: data.image,
    sameAs: [],
  }
}
