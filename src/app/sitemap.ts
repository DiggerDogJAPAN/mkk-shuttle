import { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return [
    // Core Pages
    {
      url: `${siteConfig.url}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteConfig.url}/coming-soon`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },

    // Booking Pages
    
    // Information Pages
    {
      url: `${siteConfig.url}/faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    
    // Future Route Pages
  ]
}
