let cached = null

export async function getClientMetadata() {
  if (!cached) {
    try {
      const res  = await fetch('https://ipapi.co/json/')
      const data = await res.json()
      cached = {
        ip_address: data.ip        ?? null,
        city:       data.city      ?? null,
        state:      data.region    ?? null,
        country:    data.country_name ?? null,
      }
    } catch {
      cached = { ip_address: null, city: null, state: null, country: null }
    }
  }

  const ua = navigator.userAgent

  let browser = 'Unknown'
  if (/Edg\//i.test(ua))           browser = 'Edge'
  else if (/OPR\//i.test(ua))      browser = 'Opera'
  else if (/Chrome\//i.test(ua))   browser = 'Chrome'
  else if (/Firefox\//i.test(ua))  browser = 'Firefox'
  else if (/Safari\//i.test(ua))   browser = 'Safari'

  let os = 'Unknown'
  if (/Windows NT/i.test(ua))       os = 'Windows'
  else if (/Android/i.test(ua))     os = 'Android'
  else if (/iPhone|iPad/i.test(ua)) os = 'iOS'
  else if (/Mac OS X/i.test(ua))    os = 'macOS'
  else if (/Linux/i.test(ua))       os = 'Linux'

  const deviceType = /Mobi|Android|iPhone|iPad/i.test(ua) ? 'Mobile' : 'Desktop'

  return {
    ...cached,
    device: `${deviceType} · ${browser} · ${os}`,
  }
}
