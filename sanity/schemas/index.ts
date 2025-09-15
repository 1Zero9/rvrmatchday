/**
 * Sanity Schema Types
 * 
 * Export all schema types for the CMS
 */

import news from './news'
import aboutPage from './aboutPage'
import fundraisingPage from './fundraisingPage'
import page from './page'
import siteSettings from './siteSettings'

export const schemaTypes = [
  // Documents
  news,
  aboutPage,
  fundraisingPage,
  page,
  siteSettings,
]