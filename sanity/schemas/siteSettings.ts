/**
 * Site Settings Schema
 * 
 * Global site configuration and settings
 */

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: () => '⚙️',
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      initialValue: 'Rivervalley Rangers AFC'
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text',
      initialValue: 'Community Football Since 1981'
    }),
    defineField({
      name: 'logo',
      title: 'Club Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          initialValue: 'Rivervalley Rangers AFC Logo'
        }
      ]
    }),
    defineField({
      name: 'clubColors',
      title: 'Club Colors',
      type: 'object',
      fields: [
        {
          name: 'primary',
          title: 'Primary Color (hex code)',
          type: 'string',
          initialValue: '#972A4C',
          validation: Rule => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).error('Please enter a valid hex color code')
        },
        {
          name: 'secondary',
          title: 'Secondary Color (hex code)',
          type: 'string',
          initialValue: '#5E7794',
          validation: Rule => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).error('Please enter a valid hex color code')
        },
        {
          name: 'accent',
          title: 'Accent Color (hex code)',
          type: 'string',
          initialValue: '#98C0F0',
          validation: Rule => Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).error('Please enter a valid hex color code')
        }
      ]
    }),
    defineField({
      name: 'contact',
      title: 'Contact Information',
      type: 'object',
      fields: [
        {
          name: 'email',
          title: 'Contact Email',
          type: 'email'
        },
        {
          name: 'phone',
          title: 'Contact Phone',
          type: 'string'
        },
        {
          name: 'address',
          title: 'Club Address',
          type: 'text'
        }
      ]
    }),
    defineField({
      name: 'social',
      title: 'Social Media',
      type: 'object',
      fields: [
        {
          name: 'facebook',
          title: 'Facebook URL',
          type: 'url'
        },
        {
          name: 'instagram',
          title: 'Instagram URL',
          type: 'url'
        },
        {
          name: 'twitter',
          title: 'Twitter URL',
          type: 'url'
        },
        {
          name: 'youtube',
          title: 'YouTube URL',
          type: 'url'
        }
      ]
    }),
    defineField({
      name: 'homePageSettings',
      title: 'Homepage Settings',
      type: 'object',
      fields: [
        {
          name: 'heroTitle',
          title: 'Hero Title',
          type: 'string',
          initialValue: 'Rivervalley Rangers AFC'
        },
        {
          name: 'heroSubtitle',
          title: 'Hero Subtitle',
          type: 'string',
          initialValue: 'Building Community Through Football Since 1981'
        },
        {
          name: 'heroImage',
          title: 'Hero Background Image',
          type: 'image',
          options: { hotspot: true }
        }
      ]
    }),
    defineField({
      name: 'seo',
      title: 'Default SEO Settings',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Default Meta Title',
          type: 'string'
        },
        {
          name: 'metaDescription',
          title: 'Default Meta Description',
          type: 'text'
        },
        {
          name: 'ogImage',
          title: 'Default Social Sharing Image',
          type: 'image',
          options: { hotspot: true }
        }
      ]
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      media: 'logo'
    }
  }
})