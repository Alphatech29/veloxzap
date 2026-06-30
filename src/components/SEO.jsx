import { useEffect } from 'react'
import useSettings from '../hooks/useSettings'

export default function SEO({
  title,
  description,
  path = '',
  ogType = 'website',
  ogImage,
  robots = 'index, follow',
  schema = null,
}) {
  const { settings } = useSettings()

  const baseUrl       = settings?.site_url?.replace(/\/$/, '')
  const siteName      = settings?.site_name
  const twitterHandle = settings?.twitter_handle
  const resolvedImage = ogImage || settings?.og_image

  const fullTitle = title ? `${title} | ${siteName}` : siteName
  const canonical = baseUrl ? `${baseUrl}${path}` : undefined

  useEffect(() => {
    if (!schema) return
    const id = `ld-json${path.replace(/\//g, '-') || '-home'}`
    const existing = document.getElementById(id)
    if (existing) existing.remove()
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = id
    script.textContent = JSON.stringify(schema)
    document.head.appendChild(script)
    return () => { document.getElementById(id)?.remove() }
  }, [schema, path])

  return (
    <>
      {fullTitle && <title>{fullTitle}</title>}
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}
      <meta name="robots" content={robots} />

      <meta property="og:type" content={ogType} />
      {siteName && <meta property="og:site_name" content={siteName} />}
      {fullTitle && <meta property="og:title" content={fullTitle} />}
      {description && <meta property="og:description" content={description} />}
      {canonical && <meta property="og:url" content={canonical} />}
      {resolvedImage && <meta property="og:image" content={resolvedImage} />}
      <meta property="og:locale" content="en_NG" />

      <meta name="twitter:card" content="summary_large_image" />
      {twitterHandle && <meta name="twitter:site" content={twitterHandle} />}
      {fullTitle && <meta name="twitter:title" content={fullTitle} />}
      {description && <meta name="twitter:description" content={description} />}
      {resolvedImage && <meta name="twitter:image" content={resolvedImage} />}
    </>
  )
}
