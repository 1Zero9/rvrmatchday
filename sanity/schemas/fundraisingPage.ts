/**
 * Fundraising Page Schema
 * 
 * Content type for fundraising campaigns and donation drives
 */

import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'fundraisingPage',
  title: 'Fundraising Page',
  type: 'document',
  icon: () => '💰',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Support Rivervalley Rangers AFC'
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Section Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Section Subtitle',
      type: 'text'
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text'
        }
      ]
    }),
    defineField({
      name: 'campaigns',
      title: 'Fundraising Campaigns',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'campaign',
          title: 'Campaign',
          fields: [
            {
              name: 'title',
              title: 'Campaign Title',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'description',
              title: 'Campaign Description',
              type: 'text',
              validation: Rule => Rule.required()
            },
            {
              name: 'goal',
              title: 'Fundraising Goal (€)',
              type: 'number',
              validation: Rule => Rule.required().min(0)
            },
            {
              name: 'raised',
              title: 'Amount Raised (€)',
              type: 'number',
              validation: Rule => Rule.required().min(0)
            },
            {
              name: 'image',
              title: 'Campaign Image',
              type: 'image',
              options: { hotspot: true },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alternative Text'
                }
              ]
            },
            {
              name: 'ctaText',
              title: 'Call-to-Action Text',
              type: 'string',
              initialValue: 'Donate Now'
            },
            {
              name: 'ctaUrl',
              title: 'Donation Link',
              type: 'url',
              description: 'Link to donation platform or form'
            },
            {
              name: 'active',
              title: 'Campaign Active',
              type: 'boolean',
              initialValue: true
            },
            {
              name: 'endDate',
              title: 'Campaign End Date',
              type: 'date',
              description: 'Optional end date for the campaign'
            }
          ],
          preview: {
            select: {
              title: 'title',
              goal: 'goal',
              raised: 'raised',
              media: 'image'
            },
            prepare(selection) {
              const { title, goal, raised } = selection
              const percentage = goal ? Math.round((raised / goal) * 100) : 0
              return {
                title,
                subtitle: `€${raised} / €${goal} (${percentage}%)`,
                media: selection.media
              }
            }
          }
        }
      ]
    }),
    defineField({
      name: 'content',
      title: 'Additional Content',
      type: 'array',
      description: 'General fundraising information and how to help',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' }
          ]
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text'
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'SEO Title',
          type: 'string'
        },
        {
          name: 'description',
          title: 'Meta Description',
          type: 'text'
        }
      ],
      options: {
        collapsible: true,
        collapsed: true
      }
    })
  ],
  preview: {
    select: {
      title: 'title',
      campaigns: 'campaigns',
      heroImage: 'heroImage'
    },
    prepare(selection) {
      const { title, campaigns } = selection
      const campaignCount = campaigns ? campaigns.length : 0
      return {
        title,
        subtitle: `${campaignCount} active campaign${campaignCount !== 1 ? 's' : ''}`,
        media: selection.heroImage
      }
    }
  }
})