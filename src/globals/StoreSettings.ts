import type { GlobalConfig } from 'payload';

export const StoreSettings: GlobalConfig = {
  slug: 'store-settings',
  label: 'Store & Catalog Settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'catalogAvailabilityMode',
      type: 'select',
      label: 'Meta / WhatsApp Catalog Availability Status',
      defaultValue: 'in stock',
      required: true,
      options: [
        { label: 'In Stock (Recommended for Advantage+ & WhatsApp Ads)', value: 'in stock' },
        { label: 'Available for Order (Pre-Order Mode)', value: 'available for order' },
      ],
      admin: {
        description:
          'Controls the availability field emitted by /api/feed/meta-catalog for in-stock variants.',
      },
    },
    {
      name: 'metaPixelId',
      type: 'text',
      label: 'Meta Pixel / Dataset ID',
      admin: {
        description: 'Optional override for META_PIXEL_ID environment variable.',
      },
    },
    {
      name: 'whatsappGroupInviteUrl',
      type: 'text',
      label: 'WhatsApp VIP Group Invite URL',
      admin: {
        description: 'Optional WhatsApp group or community invite link shown on order confirmation pages (e.g. https://chat.whatsapp.com/...).',
      },
    },
    {
      name: 'whatsappGroupCtaText',
      type: 'text',
      label: 'WhatsApp Group CTA Text',
      defaultValue: 'Join Momentum Drop Updates on WhatsApp',
      admin: {
        description: 'Button label shown alongside the WhatsApp group invite on the order confirmation & receipt page.',
      },
    },
  ],
};
