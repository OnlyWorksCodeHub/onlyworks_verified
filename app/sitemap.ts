import type { MetadataRoute } from 'next'

const BASE_URL = 'https://www.only-works.com'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE_URL}/`, priority: 1.0 },
    { url: `${BASE_URL}/downloads`, priority: 0.9 },
    { url: `${BASE_URL}/hiring`, priority: 0.9 },
    { url: `${BASE_URL}/talent`, priority: 0.9 },
    { url: `${BASE_URL}/about`, priority: 0.8 },
    { url: `${BASE_URL}/security`, priority: 0.8 },
    { url: `${BASE_URL}/support`, priority: 0.8 },
    { url: `${BASE_URL}/search`, priority: 0.7 },
    { url: `${BASE_URL}/careers`, priority: 0.6 },
    { url: `${BASE_URL}/contact`, priority: 0.6 },
    { url: `${BASE_URL}/privacy`, priority: 0.4 },
    { url: `${BASE_URL}/terms`, priority: 0.4 },
  ]
}