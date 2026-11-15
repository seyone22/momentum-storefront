import type { GlobalConfig } from 'payload';
import { diffRecord, writeAuditLog } from '../lib/audit';

export const StoreSettings: GlobalConfig = {
  slug: 'store-settings',
  label: 'Store & Catalog Settings',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        const changes = diffRecord(
          previousDoc as unknown as Record<string, unknown>,
          doc as unknown as Record<string, unknown>
        );
        await writeAuditLog({
          payload: req.payload,
          headers: req.headers,
          reqUser: req.user as { id?: string | number; email?: string; collection?: string } | null,
          action: 'settings.updated',
          entityType: 'store-settings',
          entityRef: 'store-settings',
          summary: `StoreSettings updated (${Object.keys(changes).join(', ') || 'saved'})`,
          metadata: { changes },
        });
        return doc;
      },
    ],
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
    {
      name: 'shippingEnabled',
      type: 'checkbox',
      label: 'Charge Shipping at Checkout',
      defaultValue: false,
      admin: {
        description: 'When unchecked, all orders receive complimentary islandwide delivery (LKR 0).',
      },
    },
    {
      name: 'colomboShippingLkr',
      type: 'number',
      label: 'Colombo & Gampaha Shipping Rate (LKR)',
      defaultValue: 350,
      min: 0,
      admin: {
        description: 'Base courier rate for Colombo and Gampaha districts.',
      },
    },
    {
      name: 'outstationShippingLkr',
      type: 'number',
      label: 'Outstation Shipping Rate (LKR)',
      defaultValue: 550,
      min: 0,
      admin: {
        description: 'Base courier rate for all other 23 Sri Lankan districts.',
      },
    },
    {
      name: 'freeShippingThresholdLkr',
      type: 'number',
      label: 'Free Shipping Threshold (LKR)',
      defaultValue: 0,
      min: 0,
      admin: {
        description: 'Orders with subtotal >= this amount ship free. Set to 0 to disable free-shipping threshold.',
      },
    },
    {
      name: 'extraPieceThreshold',
      type: 'number',
      label: 'Extra Weight Surcharge After (Pieces)',
      defaultValue: 2,
      min: 1,
      admin: {
        description: 'Number of pieces covered by base 1 kg rate before per-extra-piece surcharge applies.',
      },
    },
    {
      name: 'extraPieceSurchargeLkr',
      type: 'number',
      label: 'Per-Extra-Piece Surcharge (LKR)',
      defaultValue: 150,
      min: 0,
      admin: {
        description: 'Additional LKR added per piece above the threshold (Prompt Xpress >1 kg tariff).',
      },
    },
  ],
};
